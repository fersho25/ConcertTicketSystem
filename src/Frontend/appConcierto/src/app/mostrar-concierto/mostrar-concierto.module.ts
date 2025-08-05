import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarConciertoPageRoutingModule } from './mostrar-concierto-routing.module';

import { MostrarConciertoPage } from './mostrar-concierto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarConciertoPageRoutingModule
  ],
  declarations: [MostrarConciertoPage]
})
export class MostrarConciertoPageModule {}
