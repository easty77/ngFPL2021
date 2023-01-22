import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, exhaustMap, shareReplay, BehaviorSubject } from 'rxjs';
import { Prediction } from '../datatypes/prediction';
import { DataTable } from '../datatypes/datatable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  private fetch$ = new BehaviorSubject<void>(undefined);

  public allPredictions$: Observable<Prediction[]> = this.fetch$.pipe(
    exhaustMap(() => this.http.get<DataTable>(environment.predictionsUrl).pipe(map(odata =>odata.rowdata))),
    shareReplay(),
  );

  public refreshPredictions():void {
    this.fetch$.next();
  }
  public getWeekPredictions(weekNumber:number):Observable<Prediction[]> {
    return this.allPredictions$.pipe(map(predictions => predictions.filter(p => p.event === weekNumber)));
  }

  constructor(
    private http: HttpClient) { 
     }

}
