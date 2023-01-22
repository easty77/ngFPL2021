import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, take, BehaviorSubject, exhaustMap, switchMap, shareReplay } from 'rxjs';

import { FixturesService } from './fixtures.service';
import { FantasyLeagueService } from './fantasyleague.service';
import { OddsService } from './odds.service';
import { PredictionsService } from './predictions.service';
import { PredictorsService } from './predictors.service';
import { TableModel,
  TableItem,
  TableHeaderItem,
 } from 'carbon-components-angular';
import { Fixture } from '../datatypes/fixture';
import { Team } from '../datatypes/team';
import { Odds } from '../datatypes/odds';
import { Prediction } from '../datatypes/prediction';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private weekNumber$ = new BehaviorSubject<number>(1);

  public weekTable$: Observable<TableModel> = this.weekNumber$.pipe(
    switchMap(() => this.getWeekTable(this.weekNumber$.value)),
    shareReplay(),
  );
  public weekData$: Observable<Fixture[]> = this.weekNumber$.pipe(
    switchMap(() => this.getWeekData(this.weekNumber$.value)),
    shareReplay(),
  );


  teamData$: Observable<Team[]>;
  predictorData$: Observable<string[]>;
  columns$: Observable<string[]>;

  constructor(private fixtureService: FixturesService,
    private flService: FantasyLeagueService,
    private oddsService: OddsService,
    private predictionsService: PredictionsService,
    private predictorsService: PredictorsService) { 

      this.teamData$ = flService.getTeams();
      this.predictorData$ = predictorsService.getPredictors();
      this.columns$ = this.predictorData$.pipe(map((predictors) => {
        return ["Fixture", "Score", "Result", "Odds"].concat(predictors)
      }));
   }

  private getWeekTable(weekNumber: number): Observable<TableModel> {
    console.log('getWeekTable:' + weekNumber);
    return forkJoin([this.getWeekData(weekNumber), this.predictorData$])
      //return this.getWeekData(weekNumber)
      .pipe(
      map(([fixtures, predictors]) => {
        let simpleModel: TableModel = new TableModel();
        simpleModel.header = [
          new TableHeaderItem({data: "Fixture"}), new TableHeaderItem({data: "Score" }), new TableHeaderItem({data: "Result" }), new TableHeaderItem({data: "Odds" })
        ];
        predictors.forEach(p => {
          simpleModel.header.push(new TableHeaderItem({data: p}))
        });
        fixtures.forEach(f =>
        {
          let row: TableItem[] = [
            new TableItem({data: f.team_h_name + " v " + f.team_a_name + "(" + f.id + ")"}), 
            new TableItem({data: f.team_h_score + "-" + f.team_a_score}),
            new TableItem({data: f.result}),
            new TableItem({data: f.odds?.value}),
          ]
          predictors.forEach((p:string) => {
            const p1 = p
            if (f.predictions[p] !== undefined && f.predictions[p].team_h_score !== undefined && f.predictions[p].team_a_score !== undefined) {
              row.push(new TableItem({data: f.predictions[p].team_h_score + "-" + f.predictions[p].team_a_score}));
            }
            else {
              row.push(new TableItem({data: ""}));
            }
          });
          simpleModel.data.push(row)
        })
        return simpleModel;
      })
    );
  }
  private getWeekData(weekNumber: number): Observable<Fixture[]> {
    console.log('getWeekData:' + weekNumber);
    // Observables setup to allow reload need take(1) as they never complete
    return forkJoin([this.fixtureService.getWeekFixtures(weekNumber).pipe(take(1)), 
      this.teamData$,
      this.predictionsService.getWeekPredictions(weekNumber).pipe(take(1)),
      this.oddsService.getWeekOdds(weekNumber)])
    .pipe(
      map(([fixtures, teams, predictions, odds]): Fixture[] => {
        fixtures.forEach((f:Fixture) => {
          let hteam:Team | undefined = teams.find((t:Team) => t.id === f.team_h)
          let ateam:Team | undefined = teams.find((t:Team) => t.id === f.team_a)
          f.team_h_name = hteam?.name
          f.team_a_name = ateam?.name
          f.team_h_short_name = hteam?.short_name
          f.team_a_short_name = ateam?.short_name
        })
        //let aPredictors = [...new Set(predictions.map(item => item.predictor_id))]; 
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
              let nIndexResult = this.getResultIndex(f)
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

/*        let nIndexPrediction = getResultIndex(p)
        if (totalRow[p.predictor_id] === undefined) {
          totalRow[p.predictor_id] = {"points": 0, "correct": 0, "H":0, "D":0, "A":0, "goals":0, "count":0}
        }
        totalRow[p.predictor_id].count += 1
        totalRow[p.predictor_id].goals += (p.team_h_score + p.team_a_score)
        totalRow[p.predictor_id][['H', 'D', 'A'][nIndexPrediction]] += 1 */
/*      
        let odds:Odds | undefined;
        this.oddsService.getMatchOdds(f.id).subscribe(o => odds = o);
/*        totalRow.score += (f.score.h + f.score.a)
        totalRow.result[f.result] += 1
        totalRow.odds['F' + f.odds.rank] += 1    
        aPredictions.forEach(p => {
          totalRow[p.predictor_id].points += getPoints(p)
          totalRow[p.predictor_id].correct += (p.correct_score === 1) ? 1 : 0
        }) 
      }
    }) */
/*    setWeekResults(nFinished > 0)
    aPredictors.forEach(pid => {
      if (totalRow[pid] === undefined) {
        totalRow[pid] = {"points": 0, "correct": 0, "H":0, "D":0, "A":0, "goals":0, "count":0}
      }
      if (totalRow[pid].count > 0) {
        totalRow[pid].goals = totalRow[pid].goals/totalRow[pid].count;  // convert total goals to average goals
      }
      totalRow[pid].display = totalRow[pid].H + "-" + totalRow[pid].D + "-" + totalRow[pid].A
      totalRow[pid].full_display =  totalRow[pid].display + (" (" + totalRow[pid].goals + ")" )
    })
    if (nFinished > 0) {
      totalRow.score = Math.round(10 * totalRow.score / nFinished)/10;  // convert total goals to average goals
    }
    else{
      totalRow.score = undefined
      totalRow.result = undefined
      totalRow.odds = undefined
    }
    aFiltered.push(totalRow) */
    //return fixtures;

    }
    private getResultIndex = (f: Fixture) => {
      return (f.team_h_score !== undefined && f.team_a_score !== undefined && f.team_h_score >= f.team_a_score) ? ((f.team_h_score === f.team_a_score) ? 1 : 0): 2
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
