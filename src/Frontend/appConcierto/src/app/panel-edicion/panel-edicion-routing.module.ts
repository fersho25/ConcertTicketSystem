import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelEdicionPage } from './panel-edicion.page';

const routes: Routes = [
  {
    path: '',
    component: PanelEdicionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelEdicionPageRoutingModule {}
