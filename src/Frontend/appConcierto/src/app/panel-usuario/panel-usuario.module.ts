import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelUsuarioPageRoutingModule } from './panel-usuario-routing.module';

import { PanelUsuarioPage } from './panel-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelUsuarioPageRoutingModule
  ],
  declarations: [PanelUsuarioPage]
})
export class PanelUsuarioPageModule {}
