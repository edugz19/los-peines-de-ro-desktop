import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadDesktopPageRoutingModule } from './download-desktop-routing.module';

import { DownloadDesktopPage } from './download-desktop.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadDesktopPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DownloadDesktopPage]
})
export class DownloadDesktopPageModule {}
