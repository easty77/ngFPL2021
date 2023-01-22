import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionshipPageComponent } from './championship-page/championship-page.component';

const routes: Routes = [
  {
    path: '',
    component: ChampionshipPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChampionshipRoutingModule { }
