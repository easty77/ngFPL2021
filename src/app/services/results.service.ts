import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, take, BehaviorSubject, exhaustMap, switchMap, shareReplay } from 'rxjs';

import { FixturesService } from './fixtures.service';
import { FantasyLeagueService } from './fantasyleague.service';
import { OddsService } from './odds.service';
import { PredictionsService } from './predictions.service';
import { PredictorsService } from './predictors.service';

import { Fixture } from '../datatypes/fixture';
import { Team } from '../datatypes/team';
import { Odds } from '../datatypes/odds';
import { Prediction } from '../datatypes/prediction';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private weekNumber$ = new BehaviorSubject<number>(1);

  public weekData$: Observable<Fixture[]> = this.weekNumber$.pipe(
    exhaustMap(() => this.getWeekData(this.weekNumber$.value)),
    shareReplay(),
  );

  columns$: Observable<string[]>;

  constructor(private fixtureService: FixturesService,
    private flService: FantasyLeagueService,
    private oddsService: OddsService,
    private predictionsService: PredictionsService,
    private predictorsService: PredictorsService) { 

      this.columns$ = this.predictorsService.getPredictors().pipe(map((predictors) => {
        return ["Fixture", "Score", "Result", "Odds"].concat(predictors)
      }));
   }

  private getWeekData(weekNumber: number): Observable<Fixture[]> {
    console.log('getWeekData:' + weekNumber);
    // Observables setup to allow reload need take(1) as they never complete
    return forkJoin([this.fixtureService.getWeekFixtures(weekNumber).pipe(take(1)), 
      this.flService.teams$.pipe(take(1)),
      this.predictionsService.getWeekPredictions(weekNumber).pipe(take(1)),
      this.oddsService.getWeekOdds(weekNumber).pipe(take(1))
    ])
    .pipe(
      map(([fixtures, teams, predictions, odds]): Fixture[] => {
        fixtures = Utils.addTeamNames(fixtures, teams);
        let totalRow = {"id":"Total", "result":{"H":0, "D":0, "A":0}, odds:{"F1":0, "F2":0, "F3":0}, "score":0}
        let nFinished = 0
        fixtures.forEach(f => {
            let hteam : Team | undefined = teams.find(t => t.id === f.team_h);
            let ateam : Team | undefined = teams.find(t => t.id === f.team_a);
            //f.fixture = {"team_h":f.team_h_name, "team_a":f.team_a_name}
            let aPredictions:Prediction[] = predictions.filter(p => p.fixture_id === f.id); 
            let pr: Record<string,any> = {}
            f.predictions = pr;
            aPredictions.forEach(p => {
              pr[p.predictor_id] = p 
            })
            if (f.finished === true) {
              nFinished++
              let nIndexResult = Utils.getResultIndex(f)
              f.score = {"h":f.team_h_score, "a":f.team_a_score}
              f.result = ['H', 'D', 'A'][nIndexResult]
              let matchodds:Odds | undefined = odds?.find(o => o.fixture_id === f.id);
              if (matchodds !== undefined) {
                let value = (f.team_h_score !== undefined && f.team_a_score !== undefined && f.team_h_score >= f.team_a_score) ? ((f.team_h_score === f.team_a_score) ? matchodds.dsp_draw : matchodds.dsp_home): matchodds.dsp_away
      
                f.odds = {"value": value, "rank": matchodds.rank === undefined ? "0" : matchodds.rank[nIndexResult].toString(),
                  "display": ("H: " + matchodds.dsp_home + "\nD: " + matchodds.dsp_draw + "\nA: " + matchodds.dsp_away)}
              }
              else {
                f.odds={"value":"", "rank":"", "display":""};   // no odds info available
              }
            }
          })  
        return fixtures;
      }
    ));
    }
  setWeekNumber(weekNumber:number): void {
    this.weekNumber$.next(weekNumber)
  }
  reloadData():void {
    // only prediction and fixtures are sufficiently volatile to change during an active session
    this.fixtureService.refreshFixtures();
    this.predictionsService.refreshPredictions();
  }
}
