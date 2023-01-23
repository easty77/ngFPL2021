import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PredictionsReportService } from './predictionsreport.service';

describe('PredictionsReportService', () => {
  let service: PredictionsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(PredictionsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
