import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { OddsService } from './odds.service';

describe('OddsService', () => {
  let service: OddsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
    });
    service = TestBed.inject(OddsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
