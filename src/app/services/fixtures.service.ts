import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, filter, map, exhaustMap, shareReplay, BehaviorSubject } from 'rxjs';
import { Fixture } from '../datatypes/fixture';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixturesService {

  private fetch$ = new BehaviorSubject<void>(undefined);
  inputWeek:number = 1;

  public allFixtures$: Observable<Fixture[]> = this.fetch$.pipe(
    exhaustMap(() => this.http.get<Fixture[]>(environment.fixturesUrl)),
    shareReplay(),
  );

  constructor(
    private http: HttpClient) { }

    public refreshFixtures() {
      this.fetch$.next();
    }
    getCompletedFixtures(): Observable<Fixture[]> {
      return this.allFixtures$.pipe(map(fixtures => fixtures.filter(f => f.finished === true)));
    }
    private getInputWeek(fixtures: Fixture[]): number {
      fixtures = fixtures.filter(f => f.finished === false && f.event !== null);
      let nMin: number | undefined = Math.min(...fixtures.map(o => o.event === undefined ? 100 : o.event));
      return nMin === undefined ? 1 : nMin;
    }

    getInputWeekFixtures(): Observable<Fixture[]> {
      return this.allFixtures$.pipe(map(fixtures => {
        let inputWeekNumber: number = this.getInputWeek(fixtures);
        return fixtures.filter(f => f.event === inputWeekNumber).sort(this.sortFixtures);
      }
      ));
    }
    getInputWeekNumber(): Observable<number> {
      return this.allFixtures$.pipe(map(fixtures => {
        return this.getInputWeek(fixtures);
      }
      ));
    }
    getWeekFixtures(weekNumber:number): Observable<Fixture[]> {
    return this.allFixtures$.pipe(map(fixtures => fixtures.filter(f => f.event === weekNumber).sort(this.sortFixtures)));
  }
  private sortFixtures(a: Fixture, b: Fixture): number {
    if (a.kickoff_time !== undefined && b.kickoff_time && a.kickoff_time > b.kickoff_time) {
      return 1;
    }
    else if (a.kickoff_time !== undefined && b.kickoff_time && b.kickoff_time > a.kickoff_time) {
      return -1;
    }
    else {
      if (a.team_h_name !== undefined && b.team_h_name !== undefined) {
        return a.team_h_name.localeCompare(b.team_h_name)
      }
    }
    return 0;
  }
}
