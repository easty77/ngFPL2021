import { TestBed } from '@angular/core/testing';

import { PreviousInstanceService } from './previousinstance.service';

describe('PreviousInstanceService', () => {
  let service: PreviousInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
