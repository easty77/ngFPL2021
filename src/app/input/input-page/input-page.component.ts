import { Component } from '@angular/core';
import { InputReportService } from '../../services/inputreport.service';
import { Observable } from 'rxjs';
import { Fixture } from '../../datatypes/fixture';

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.scss']
})
export class InputPageComponent {

  fixtures$: Observable<Fixture[]> = this.inputReportService.fixtures$;
  weekNumber$: Observable<number> = this.inputReportService.weekNumber$;

  constructor(private inputReportService: InputReportService) {
  }

}
