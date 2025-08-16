import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarUsuarioAdministradorPage } from './editar-usuario-administrador.page';

const routes: Routes = [
  {
    path: '',
    component: EditarUsuarioAdministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarUsuarioAdministradorPageRoutingModule {}
