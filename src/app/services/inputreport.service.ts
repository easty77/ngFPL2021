import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, take, BehaviorSubject, exhaustMap, switchMap, shareReplay } from 'rxjs';

import { FixturesService } from './fixtures.service';
import { FantasyLeagueService } from './fantasyleague.service';
import { OddsService } from './odds.service';
import { PredictionsService } from './predictions.service';
import { PredictorsService } from './predictors.service';
import { Fixture } from '../datatypes/fixture';
import { Team } from '../datatypes/team';
import { Odds } from '../datatypes/odds';
import { Prediction } from '../datatypes/prediction';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class InputReportService {
  private fetch$ = new BehaviorSubject<void>(undefined);

  weekNumber$: Observable<number> = this.fixtureService.getInputWeekNumber();

  public fixtures$: Observable<Fixture[]> = this.fetch$.pipe(
    exhaustMap(() => this.getInputReportData()),
    shareReplay(),
  );

  constructor(private fixtureService: FixturesService,
    private flService: FantasyLeagueService) { 
    }


    private getInputReportData(): Observable<Fixture[]> {
      console.log('getInputReportData');
      // Observables setup to allow reload need take(1) as they never complete
      return forkJoin([this.fixtureService.getInputWeekFixtures().pipe(take(1)), 
        this.flService.teams$.pipe(take(1))
      ])
      .pipe(
        map(([fixtures, teams]): Fixture[] => {
          fixtures = Utils.addTeamNames(fixtures, teams);
          return fixtures;
        }
        ));
      }
  }
