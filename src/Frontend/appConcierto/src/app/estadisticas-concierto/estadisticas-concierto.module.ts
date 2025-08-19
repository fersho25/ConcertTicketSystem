import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticasConciertoPageRoutingModule } from './estadisticas-concierto-routing.module';

import { EstadisticasConciertoPage } from './estadisticas-concierto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticasConciertoPageRoutingModule
  ],
  declarations: [EstadisticasConciertoPage]
})
export class EstadisticasConciertoPageModule {}
