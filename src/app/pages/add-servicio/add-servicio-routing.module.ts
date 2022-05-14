import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddServicioPage } from './add-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: AddServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddServicioPageRoutingModule {}
