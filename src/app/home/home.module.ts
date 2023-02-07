import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EuiTableModule } from '@eui/components/eui-table';
import { EuiButtonModule } from '@eui/components/eui-button';
import { EuiSelectModule } from '@eui/components/eui-select';

@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    EuiTableModule,
    EuiSelectModule,
    EuiButtonModule
  ]
})
export class HomeModule { }
