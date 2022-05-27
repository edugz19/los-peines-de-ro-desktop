import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadAndroidPageRoutingModule } from './download-android-routing.module';

import { DownloadAndroidPage } from './download-android.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadAndroidPageRoutingModule, 
    ComponentsModule
  ],
  declarations: [DownloadAndroidPage]
})
export class DownloadAndroidPageModule {}
