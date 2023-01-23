import { Component } from '@angular/core';
import { EventPredictions } from '../../datatypes/eventpredictions';
import { EventPredictor } from '../../datatypes/eventpredictor';
import { Observable, forkJoin, map, of, take, BehaviorSubject, exhaustMap, switchMap, shareReplay } from 'rxjs';
import { PredictionsReportService } from '../../services/predictionsreport.service';

@Component({
  selector: 'app-predictions-page',
  templateUrl: './predictions-page.component.html',
  styleUrls: ['./predictions-page.component.scss']
})
export class PredictionsPageComponent {

  predictionsdata: EventPredictions[] = [];
  columns$ : Observable<string[]>;

  constructor(private reportService: PredictionsReportService) {
    reportService.predictionsData$.subscribe(predictionsdata => this.predictionsdata = predictionsdata);
    this.columns$ = reportService.columns$;
  }
  getClassName(column:string, fixture:EventPredictions, scoreType:string): string {
    if (column !== 'Event' && column !== 'Result' && column !== 'Odds') {
      let predictor: EventPredictor = fixture.predictions[column];
      if (scoreType in predictor) {
        return `cell rank${predictor[scoreType as keyof EventPredictor].rank}`;
      }
    }
    return "";
  }
  getTotal(column:string, display_type:string): string {
    if (column === 'Event') {
      return "Total";
    }
    else if (column !== 'Result' && column !== 'Odds') {
      return this.getPredictorTotal(column, display_type);
    }
    else {
      return "";
    }
  }
  getPredictorTotal(predictor:string, display_type:string) : string {
    console.log("getPredictorTotal: " + predictor)
    let total: number= this.predictionsdata.reduce((acc, value) => {
      let prediction: EventPredictor | undefined = value.predictions[predictor];
      if ( prediction !== undefined && display_type in prediction) {
        return acc + prediction[display_type as keyof EventPredictor].value;
      }
      else {
        return acc;
      }
      }, 0);
      if (display_type === 'profit') {
        return total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      }
      else {
        return total.toString();
      }
  }
}
