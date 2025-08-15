import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelUsuarioPage } from './panel-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: PanelUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelUsuarioPageRoutingModule {}
