import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosPageRoutingModule } from './servicios-routing.module';

import { ServiciosPage } from './servicios.page';
import { ComponentsModule } from '../../components/components.module';

import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosPageRoutingModule,
    ComponentsModule,
    NgxPaginationModule
  ],
  declarations: [ServiciosPage]
})
export class ServiciosPageModule {}
