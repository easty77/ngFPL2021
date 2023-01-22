import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'championship',
    loadChildren: () =>
      import('./championship/championship.module').then(
        (m) => m.ChampionshipModule
      ),
  },
  {
    path: 'input',
    loadChildren: () =>
      import('./input/input.module').then(
        (m) => m.InputModule
      ),
  },
  {
    path: 'predictions',
    loadChildren: () =>
      import('./predictions/predictions.module').then(
        (m) => m.PredictionsModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(
        (m) => m.AdminModule
      ),
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
