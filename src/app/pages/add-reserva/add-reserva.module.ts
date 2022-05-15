import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { AddReservaPageRoutingModule } from './add-reserva-routing.module';

import { AddReservaPage } from './add-reserva.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReservaPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [AddReservaPage],
  providers: []
})
export class AddReservaPageModule {}
