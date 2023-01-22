import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipPageComponent } from './championship-page/championship-page.component';


@NgModule({
  declarations: [
    ChampionshipPageComponent
  ],
  imports: [
    CommonModule,
    ChampionshipRoutingModule
  ]
})
export class ChampionshipModule { }
