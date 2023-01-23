import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FantasyLeagueService } from './fantasyleague.service';

describe('FantasyLeagueService', () => {
  let service: FantasyLeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
    });
    service = TestBed.inject(FantasyLeagueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
