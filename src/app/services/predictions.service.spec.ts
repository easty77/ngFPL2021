import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PredictionsService } from './predictions.service';

describe('PredictionsService', () => {
  let service: PredictionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(PredictionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
