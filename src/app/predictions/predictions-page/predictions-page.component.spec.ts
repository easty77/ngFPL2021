import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SelectModule } from 'carbon-components-angular/select';
import { TableModule } from 'carbon-components-angular/table';

import { PredictionsPageComponent } from './predictions-page.component';

describe('PredictionsPageComponent', () => {
  let component: PredictionsPageComponent;
  let fixture: ComponentFixture<PredictionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, SelectModule, TableModule], 
      declarations: [ PredictionsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
