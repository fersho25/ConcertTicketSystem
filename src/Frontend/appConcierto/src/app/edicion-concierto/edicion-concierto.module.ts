import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdicionConciertoPageRoutingModule } from './edicion-concierto-routing.module';

import { EdicionConciertoPage } from './edicion-concierto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EdicionConciertoPageRoutingModule
  ],
  declarations: [EdicionConciertoPage]
})
export class EdicionConciertoPageModule {}
