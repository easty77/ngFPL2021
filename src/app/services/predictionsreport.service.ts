import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, take, BehaviorSubject, exhaustMap, switchMap, shareReplay } from 'rxjs';

import { FixturesService } from './fixtures.service';
import { PredictionsService } from './predictions.service';
import { PredictorsService } from './predictors.service';
import { OddsService } from './odds.service';
import { Fixture } from '../datatypes/fixture';
import { Prediction } from '../datatypes/prediction';
import { Odds } from '../datatypes/odds';
import { EventFixtures } from '../datatypes/eventfixtures';
import { EventPredictions } from '../datatypes/eventpredictions';
import { EventPredictor } from '../datatypes/eventpredictor';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class PredictionsReportService {

  private fetch$ = new BehaviorSubject<void>(undefined);

  public predictionsData$: Observable<EventPredictions[]> = this.fetch$.pipe(
    exhaustMap(() => this.getPredictionsData()),
    shareReplay(),
  );

  columns$: Observable<string[]>;

  constructor(private fixtureService: FixturesService,
    private predictionsService: PredictionsService,
    private predictorsService: PredictorsService,
    private oddsService: OddsService) { 
      this.columns$ = this.predictorsService.getPredictors().pipe(map((predictors) => {
        return ["Event", "Result", "Odds"].concat(predictors)
      }));
   }
  private getPredictionsData(): Observable<EventPredictions[]> {
      console.log('getPredictionsData');
      // Observables setup to allow reload need take(1) as they never complete
      return forkJoin([this.fixtureService.getCompletedFixtures().pipe(take(1)), 
        this.oddsService.allOdds$.pipe(take(1)),
        this.predictionsService.allPredictions$.pipe(take(1)),
         this.predictorsService.getPredictors().pipe(take(1))
      ])
      .pipe(
        map(([fixtures, odds, predictions, predictors]): any[] => {
          let eventPredictions: Record<number, Record<string,EventPredictor>> =
            this.getPredictionsAggregate(fixtures, odds, predictions, predictors);
          let eventResults: Record<number, EventFixtures>  =
            this.getResultsAggregate(fixtures, odds);

                // add rank
        let aAttributes = ['correct', 'points', 'profit']
        for(let event in eventPredictions){
          let r: Record<string,EventPredictor> = eventPredictions[event]
          aAttributes.forEach( x => {
            let aValues: number[] = []
            predictors.forEach(p => {
              if (x in r[p]) {
                aValues.push(r[p][x as keyof EventPredictor].value)
              }
            })
            let aRank = Utils.rankArray(aValues, false)
            predictors.forEach((p, index) => {
              if (x in r[p]) {
                r[p][x as keyof EventPredictor].rank = aRank[index]
              }
            })
          })
        }
        
          let events: EventPredictions[] = [];  
          for(let event in eventPredictions){
            let fixture: EventFixtures = eventResults[event];
              events.push(
                {event: parseInt(event, 10), predictions: eventPredictions[event], 
                result:fixture.result["H"] + "-" + fixture.result["D"] + "-" + fixture.result["A"], 
                odds:fixture.odds["1"] + "-" + fixture.odds["2"] + "-" + fixture.odds["3"], 
                }
              )  
          }
          return events;
        }
          ));
  }
  getPredictionsAggregate(fixtures:Fixture[], odds:Odds[], predictions:Prediction[], predictors:string[]): Record<number, Record<string,EventPredictor>> {
      return predictions.reduce((prev:Record<number, Record<string,EventPredictor>>, next:Prediction) =>{
        let event:number = next.event
        if (!(event in prev)) {
           prev[event] = this.createScoreRow(predictors)
        }
        // tested using predictor_id=XX, so that dmust not break
        // match must have taken place
        if (prev[event][next.predictor_id] !== undefined && next.correct_score !== undefined && next.bonus_score !== undefined) {
          prev[event][next.predictor_id].correct.value += next.correct_score 
          prev[event][next.predictor_id].points.value += (3 * next.correct_score) + next.bonus_score
          let profit_value = -1; 
          if (next.correct_score === 1) {
            let profit = Utils.calculateFixtureProfit(fixtures.find(f => f.id === next.fixture_id), odds.find(o => o.fixture_id === next.fixture_id));
            profit_value = profit.value
            if (prev[event][next.predictor_id].profit.display != "") {
              prev[event][next.predictor_id].profit.display += ", "
            }
            prev[event][next.predictor_id].profit.display +=  profit.display 
          }
          prev[event][next.predictor_id].profit.value += profit_value
        }
         return prev;
      }, {});
  }
  getResultsAggregate(fixtures:Fixture[], odds:Odds[]): Record<number, EventFixtures> {
    return fixtures.reduce((prev:Record<number, EventFixtures>, next:Fixture) =>{
      if (next.event !== undefined) {
        if (prev[next.event] === undefined) {
          prev[next.event] = {"result":{"H":0, "D": 0, "A" : 0}, "odds":{"1":0, "2":0, "3":0}}
        }
        let nIndex = Utils.getResultIndex(next)
        prev[next.event].result[['H', 'D', 'A'][nIndex]]++
        let matchodds = odds.find(o => o.fixture_id === next.id)
        if (matchodds !== undefined) {
          let resultOddsRank = Utils.rankOdds([matchodds.home, matchodds.draw, matchodds.away])[nIndex]
          prev[next.event].odds[resultOddsRank]++
        }
      } 
      return prev;
    }, {});
  }
  private createScoreRow(predictors:string[]): Record<string,EventPredictor>{
    let empty:Record<string,EventPredictor> = {}
    predictors.forEach(p => {
      let ep: EventPredictor = {"correct":{"value":0, "rank":0}, "points":{"value":0, "rank":0}, "profit":{"value":0, "display":"", "rank":0}}
      empty[p] = ep;
    }) 
    return empty;      
  } 
}
