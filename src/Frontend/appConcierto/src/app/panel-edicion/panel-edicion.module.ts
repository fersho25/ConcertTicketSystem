import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelEdicionPageRoutingModule } from './panel-edicion-routing.module';

import { PanelEdicionPage } from './panel-edicion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelEdicionPageRoutingModule,
    PanelEdicionPage
  ],
})
export class PanelEdicionPageModule {}
