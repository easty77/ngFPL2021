import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, exhaustMap, shareReplay } from 'rxjs';
import { Odds } from '../datatypes/odds';
import { DataTable } from '../datatypes/datatable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OddsService {
  // don't really need to refresh this data, but the BehaviorSubject also seems to avoid an http call
  // when getWeekOdds is called
  // perhaps should setWeek (like for Results), but would also need setMatch?
  private fetch$ = new BehaviorSubject<void>(undefined);

  public allOdds$: Observable<Odds[]> = this.fetch$.pipe(
    exhaustMap(() => this.http.get<DataTable>(environment.oddsUrl).pipe(map(odata =>odata.rowdata.map(o => {o.rank = this.rankOdds([o.home, o.draw, o.away]); return o;})))),
    shareReplay(),
  );

  constructor(
    private http: HttpClient) { 
     }

  getMatchOdds(id:number): Observable<Odds | undefined> {
    return this.allOdds$.pipe(map(odds => odds.find(o => o.fixture_id === id)));
  }
  getWeekOdds(id:number): Observable<Odds[] | undefined> {
    console.log("In getWeekOdds");
    return this.allOdds$.pipe(map(odds => odds.filter(o => o.event === id)));
  }
private rankOdds(arr:any[]) {
    return this.rankArray(arr, true).join('');
 }
 private rankArray(arr:any[], bAscending:boolean):number[] {

    let sorted = arr.slice().sort(function(a, b) {
        return bAscending ? (a - b) : (b - a)
      })
      let ranks:number[] = arr.slice().map(function(v) {
        return sorted.indexOf(v) + 1
      });

      return ranks
}
}
