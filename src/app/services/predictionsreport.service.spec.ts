import { TestBed } from '@angular/core/testing';

import { PredictionsReportService } from './predictionsreport.service';

describe('PredictionsReportService', () => {
  let service: PredictionsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
