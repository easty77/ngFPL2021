import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OddsService } from './odds.service';

describe('OddsService', () => {
  let service: OddsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(OddsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
