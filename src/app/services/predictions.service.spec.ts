import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PredictionsService } from './predictions.service';

describe('PredictionsService', () => {
  let service: PredictionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
    });
    service = TestBed.inject(PredictionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
