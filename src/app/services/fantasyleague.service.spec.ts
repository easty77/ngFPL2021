import { TestBed } from '@angular/core/testing';

import { FantasyLeagueService } from './fantasyleague.service';

describe('FantasyLeagueService', () => {
  let service: FantasyLeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FantasyLeagueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
