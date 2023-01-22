import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const predictors = ["SE", "TE", "ME", "PE", "AP"]

@Injectable({
  providedIn: 'root'
})
export class PredictorsService {

  constructor() { }

  getPredictors():Observable<string[]> {
    return of(predictors);
  }
}
