import { TestBed } from '@angular/core/testing';

import { ResultsSequenceService } from './resultssequence.service';

describe('ResultsSequenceService', () => {
  let service: ResultsSequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsSequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
