import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputRoutingModule } from './input-routing.module';
import { InputPageComponent } from './input-page/input-page.component';


@NgModule({
  declarations: [
    InputPageComponent
  ],
  imports: [
    CommonModule,
    InputRoutingModule
  ]
})
export class InputModule { }
