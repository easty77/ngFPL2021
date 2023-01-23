import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FixturesService } from './fixtures.service';

describe('FixturesService', () => {
  let service: FixturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(FixturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
