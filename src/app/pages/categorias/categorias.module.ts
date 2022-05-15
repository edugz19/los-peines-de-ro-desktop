import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasPageRoutingModule } from './categorias-routing.module';

import { CategoriasPage } from './categorias.page';

import { ComponentsModule } from 'src/app/components/components.module';

import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasPageRoutingModule,
    ComponentsModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  declarations: [CategoriasPage]
})
export class CategoriasPageModule {}
