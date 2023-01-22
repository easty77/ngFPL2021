import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictionsRoutingModule } from './predictions-routing.module';
import { PredictionsPageComponent } from './predictions-page/predictions-page.component';


@NgModule({
  declarations: [
    PredictionsPageComponent
  ],
  imports: [
    CommonModule,
    PredictionsRoutingModule
  ]
})
export class PredictionsModule { }
