import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderModule } from 'carbon-components-angular/ui-shell';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [HeaderModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

TestBed.configureTestingModule({
  declarations: [HeaderComponent],
  imports: [HeaderModule]
});