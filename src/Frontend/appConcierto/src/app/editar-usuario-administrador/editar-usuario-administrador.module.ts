import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarUsuarioAdministradorPageRoutingModule } from './editar-usuario-administrador-routing.module';

import { EditarUsuarioAdministradorPage } from './editar-usuario-administrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarUsuarioAdministradorPageRoutingModule
  ],
  declarations: [EditarUsuarioAdministradorPage]
})
export class EditarUsuarioAdministradorPageModule {}
