import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarConciertoPage } from './mostrar-concierto.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarConciertoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarConciertoPageRoutingModule {}
