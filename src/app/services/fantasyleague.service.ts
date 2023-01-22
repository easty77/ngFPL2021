import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Team } from '../datatypes/team';
import { FantasyLeagueData } from '../datatypes/fantasyleaguedata';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FantasyLeagueService {
  // data static over course of a season - no need to provide refresh
  teams$ : Observable<Team[]>;

  constructor(
    private http: HttpClient) 
    { 
      this.teams$ = this.http.get<FantasyLeagueData>(environment.bootstrapUrl).pipe(map((fldata:FantasyLeagueData) =>fldata.teams));
    }
    
  getTeams(): Observable<Team[]> {
    return this.teams$;
  }
}
