import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadDesktopPage } from './download-desktop.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadDesktopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadDesktopPageRoutingModule {}
