import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuiTableModule } from '@eui/components/eui-table';
import { EuiSelectModule } from '@eui/components/eui-select';

import { PredictionsRoutingModule } from './predictions-routing.module';
import { PredictionsPageComponent } from './predictions-page/predictions-page.component';


@NgModule({
  declarations: [
    PredictionsPageComponent
  ],
  imports: [
    CommonModule,
    PredictionsRoutingModule,
    EuiTableModule,
    EuiSelectModule,
  ]
})
export class PredictionsModule { }
