import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServicioPageRoutingModule } from './add-servicio-routing.module';

import { AddServicioPage } from './add-servicio.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ServiciosPage } from '../servicios/servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddServicioPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddServicioPage
  ],
  providers: [
    ServiciosPage
  ]
})
export class AddServicioPageModule {}
