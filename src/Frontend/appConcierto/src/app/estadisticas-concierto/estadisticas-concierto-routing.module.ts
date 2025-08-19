import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasConciertoPage } from './estadisticas-concierto.page';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasConciertoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticasConciertoPageRoutingModule {}
