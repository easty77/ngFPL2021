import { TestBed } from '@angular/core/testing';

import { InputReportService } from './inputreport.service';

describe('InputReportService', () => {
  let service: InputReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
