import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SelectModule } from 'carbon-components-angular/select';
import { TableModule } from 'carbon-components-angular/table';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, SelectModule, TableModule], 
      declarations: [ LandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('selectWeek should change week number', () => {
    expect(component.selectedWeek)
      .withContext('1 to start')
      .toEqual(1);
    const bannerElement: HTMLElement = fixture.nativeElement;
    const sel = bannerElement.querySelector('select')!;
    expect(sel.value)
      .withContext('retrieve from select')
      .toEqual('1');

    component.setWeek(20);
    expect(component.selectedWeek)
      .withContext('reset to 20')
      .toEqual(20);
  });

});
