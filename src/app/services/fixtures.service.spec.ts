import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FixturesService } from './fixtures.service';
import { Fixture } from '../datatypes/fixture';

describe('FixturesService', () => {
  let service: FixturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
    });
    service = TestBed.inject(FixturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('allFixtures should return 380 records',
  (done: DoneFn) => {
  service.allFixtures$.subscribe((fixtures:Fixture[]) => {
    expect(fixtures.length).toEqual(380);
    done();
  });
});

it('#Fixtures in week 1 should equal 10 records',
  (done: DoneFn) => {
  service.getWeekFixtures(1).subscribe((fixtures:Fixture[]) => {
    expect(fixtures.length).toEqual(10);
    done();
  });
});
it('All Fixtures in week 1 should have event=1',
  (done: DoneFn) => {
  service.getWeekFixtures(1).subscribe((fixtures:Fixture[]) => {
    let unique:(number | undefined)[] = [...new Set(fixtures.map((item) => item.event))]
    expect(unique.length).toEqual(1);
    expect(unique[0]).toEqual(1);
    done();
  });
});
it('Completed Fixtures are GT 0 and LT 380 and max event = 20',
  (done: DoneFn) => {
  service.getCompletedFixtures().subscribe((fixtures:Fixture[]) => {
    expect(fixtures.length).toBeGreaterThan(0);
    expect(fixtures.length).toBeLessThanOrEqual(380);
    let maxEvent:number = Math.max.apply(null, fixtures.map(f => f.event === undefined ? -1 : f.event));
    expect(maxEvent).toEqual(20);   
    done();
  });
});

});
