import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FantasyLeagueService } from './fantasyleague.service';

describe('FantasyLeagueService', () => {
  let service: FantasyLeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(FantasyLeagueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
