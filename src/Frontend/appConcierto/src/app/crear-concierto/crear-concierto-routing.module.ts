import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearConciertoPage } from './crear-concierto.page';

const routes: Routes = [
  {
    path: '',
    component: CrearConciertoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearConciertoPageRoutingModule {}
