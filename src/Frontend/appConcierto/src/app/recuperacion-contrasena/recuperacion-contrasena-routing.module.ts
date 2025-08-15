import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperacionContrasenaPage } from './recuperacion-contrasena.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperacionContrasenaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperacionContrasenaPageRoutingModule {}
