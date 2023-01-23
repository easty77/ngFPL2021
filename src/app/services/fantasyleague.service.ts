import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, exhaustMap, shareReplay } from 'rxjs';
import { Team } from '../datatypes/team';
import { FantasyLeagueData } from '../datatypes/fantasyleaguedata';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FantasyLeagueService {
  // data static over course of a season - no need to provide refresh
 // don't really need to refresh this data, but the BehaviorSubject also seems to avoid an http call
  // when getWeekOdds is called
  // perhaps should setWeek (like for Results), but would also need setMatch?
  private fetch$ = new BehaviorSubject<void>(undefined);

  public teams$: Observable<Team[]> = this.fetch$.pipe(
    exhaustMap(() => this.http.get<FantasyLeagueData>(environment.bootstrapUrl).pipe(map((fldata:FantasyLeagueData) =>fldata.teams))),
    shareReplay(),
  );
  constructor(private http: HttpClient) 
    { 
      console.log("In FantasyLeagueService constructor")
    }
    
  getTeams(): Observable<Team[]> {
    return this.teams$;
  }
}
