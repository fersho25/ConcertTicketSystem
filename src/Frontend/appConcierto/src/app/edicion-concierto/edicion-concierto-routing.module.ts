import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdicionConciertoPage } from './edicion-concierto.page';

const routes: Routes = [
  {
    path: '',
    component: EdicionConciertoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdicionConciertoPageRoutingModule {}
