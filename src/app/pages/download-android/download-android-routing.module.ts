import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadAndroidPage } from './download-android.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadAndroidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadAndroidPageRoutingModule {}
