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
}
