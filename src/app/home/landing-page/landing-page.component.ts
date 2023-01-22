import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { FixturesService } from '../../services/fixtures.service';
import { FantasyLeagueService } from '../../services/fantasyleague.service';
import { OddsService } from '../../services/odds.service';
import { PredictionsService } from '../../services/predictions.service';
import { PredictorsService } from '../../services/predictors.service';
import { ResultsService } from '../../services/results.service';
import { Fixture } from '../../datatypes/fixture';
import { Team } from '../../datatypes/team';
import { Odds } from '../../datatypes/odds';
import { Prediction } from '../../datatypes/prediction';

import {
  TableModel,
} from "carbon-components-angular/table";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  // doesn't display on load (only reacts to changes made on screen)
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class LandingPageComponent {
  // selected week
  selectedWeek: number = 1;
  weekFixtures: Fixture[] = [];

  // full data 
  fixtures: Fixture[] = [];
  teams: Team[] = [];
  odds: Odds[] = [];
  predictions: Prediction[] = [];
  predictors: String[] = [];
  asyncTeams!:Observable<Team[]>;

	model: TableModel = new TableModel();
  weekdata: Fixture[] = [];
  title: string = "Title";
  description: string = "Description";
  columns$ : Observable<string[]>;

  constructor(private fixtureService: FixturesService,
    private flService: FantasyLeagueService,
    private oddsService: OddsService,
    private predictionsService: PredictionsService,
    private predictorsService: PredictorsService,
    private resultsService: ResultsService) {
    this.getFixtures();
    this.getTeams();
    this.getOdds();
    this.getPredictions();
    this.getPredictors();
    //this.getWeekTable().subscribe(model => this.model = model);
    resultsService.weekData$.subscribe(weekdata => this.weekdata = weekdata);
    //resultsService.weekTable$.subscribe(model => this.model = model);
    //resultsService.setWeekNumber(this.selectedWeek);
    this.columns$ = resultsService.columns$;
  }

  getFixtures(): void {
    this.fixtureService.allFixtures$
        .subscribe(fixtures => {
          this.fixtures = fixtures.sort((a,b) => a.id - b.id);
          this.weekFixtures = this.getWeekFixtures();
        });
  }
  getWeekFixtures():Fixture[] {
    console.log("getWeekFixtures: " + this.selectedWeek);
    return this.fixtures.filter(f => f.event === this.selectedWeek);
  }
  getTeams():void {
    console.log("getTeams");
    this.flService.getTeams()
      .subscribe(teams => this.teams = teams);
  }
  getOdds():void {
    this.oddsService.getOdds()
      .subscribe(odds => this.odds = odds);
  }
  getPredictions():void {
    this.predictionsService.allPredictions$
      .subscribe(predictions => this.predictions = predictions);
  }
  refreshPredictions():void {
    this.predictionsService.refreshPredictions();
  }
  getPredictors():void {
    this.predictorsService.getPredictors()
      .subscribe(predictors => this.predictors = predictors);
  }
  reloadData():void {
    this.resultsService.reloadData();
  }
/*  getWeekData():Observable<Fixture[]> {
    return this.resultsService.getWeekData(this.selectedWeek);
  }
  getWeekTable():Observable<TableModel> {
    return this.resultsService.getWeekTable(this.selectedWeek);
  } */
  selectWeek(week:string) {
    console.log(week)
    this.setWeek(parseInt(week, 10));
  } 
  setWeek(weekNumber:number) {
    this.selectedWeek = weekNumber;
    this.weekFixtures = this.getWeekFixtures();
    this.resultsService.setWeekNumber(weekNumber);
  }
  getClassName(column:string, fixture:Fixture): string {
    if (column === "Odds") {
      return `cell odds odds${fixture.odds?.rank}`
    }
    else if (column !== "Fixture" && column !== "Score" && column !== "Result") {
      let prediction : Prediction = fixture.predictions[column]
      if (prediction !== undefined) {
        let total_score : number | undefined;
        if (prediction.correct_score !== undefined && prediction.bonus_score !== undefined) {
          total_score = (3*prediction.correct_score) + prediction.bonus_score;
        } 
        return total_score !== undefined ? `points_${total_score}` : `result_${fixture.result}`;
      }
      else {
        return "";
      }
    }
    else {
      return column;
    }
  }
  getTotal(column:string): string {
    let value:string = "";
    switch (column) {
      case "Fixture": {
        value = "Total"
        break;
      } 
      case "Score": {
        value = this.getAverageGoals().toString();
        break;
      }
      case "Result": {
        value = this.getTotalResults();
        break;
      }
      case "Odds": {
        value = this.getTotalOdds();
        break;
      }
      default: {
        value = this.getTotalPoints(column);
      }
    }
    return value;
}
getTotalPoints(predictor:string) : string {
  console.log("getTotalPoints: " + predictor)
  let nPoints:number  = this.weekdata.reduce((acc, value) => {
    let prediction: Prediction | undefined = value.predictions[predictor];
    if ( prediction !== undefined && prediction.correct_score !== undefined && prediction.bonus_score !== undefined) {
      return acc + (prediction.correct_score * 3) + prediction.bonus_score;
    }
    else {
      return acc;
    }
    }, 0);
    let nCorrect:number  = this.weekdata.reduce((acc, value) => {
      let prediction: Prediction | undefined = value.predictions[predictor];
      if ( prediction !== undefined && prediction.correct_score !== undefined && prediction.bonus_score !== undefined) {
        return acc + prediction.correct_score;
      }
      else {
        return acc;
      }
      }, 0);
  return nPoints + "(" + nCorrect + ")";
}
  getTotalResults():string {
    console.log("getTotalResults")
    let nH:number  = this.weekdata.reduce((acc, value) => {
      return acc + (value.result !== undefined && value.result === "H" ? 1: 0);
      }, 0);
    let nA:number  = this.weekdata.reduce((acc, value) => {
      return acc + (value.result !== undefined && value.result === "A" ? 1: 0);
      }, 0);
    let nD:number  = this.weekdata.reduce((acc, value) => {
      return acc + (value.result !== undefined && value.result === "D" ? 1: 0);
      }, 0);

      return nH + "-" + nD + "-" + nA;
  }
  getTotalOdds():string {
    console.log("getTotalOdds")
    let n1:number  = this.weekdata.reduce((acc, value) => {
      return acc + (value.odds !== undefined && value.odds.rank === "1" ? 1: 0);
      }, 0);
    let n2:number  = this.weekdata.reduce((acc, value) => {
      return acc + (value.odds !== undefined && value.odds.rank === "2" ? 1: 0);
      }, 0);
    let n3:number  = this.weekdata.reduce((acc, value) => {
      return acc + (value.odds !== undefined && value.odds.rank === "3" ? 1: 0);
      }, 0);

      return n1 + "-" + n2 + "-" + n3;
  }
  getAverageGoals():number {
    console.log("getAverageGoals")
    let nGoals:number  = this.weekdata.reduce((acc, value) => {
      let nMatchGoals = 0
      if (value.team_h_score !== undefined && value.team_a_score !== undefined) {
      nMatchGoals = value.team_h_score + value.team_a_score;
      }
      return acc + nMatchGoals
    }, 0);
    
    let nMatches:number  = this.weekdata.reduce((acc, value) => {
      let nMatchGoals = 0
      if (value.team_h_score !== undefined && value.team_a_score !== undefined) {
        return acc+1;
      }
      else {
        return acc;
      }
    }, 0);
    return nGoals/nMatches;
  }
}
