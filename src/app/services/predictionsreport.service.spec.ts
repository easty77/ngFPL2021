import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PredictionsReportService } from './predictionsreport.service';

describe('PredictionsReportService', () => {
  let service: PredictionsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
    });
    service = TestBed.inject(PredictionsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
