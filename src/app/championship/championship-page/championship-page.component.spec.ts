import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipPageComponent } from './championship-page.component';

describe('ChampionshipPageComponent', () => {
  let component: ChampionshipPageComponent;
  let fixture: ComponentFixture<ChampionshipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChampionshipPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionshipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
