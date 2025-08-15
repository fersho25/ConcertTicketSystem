import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperacionContrasenaPageRoutingModule } from './recuperacion-contrasena-routing.module';

import { RecuperacionContrasenaPage } from './recuperacion-contrasena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecuperacionContrasenaPageRoutingModule
  ],
  declarations: [RecuperacionContrasenaPage]
})
export class RecuperacionContrasenaPageModule {}
