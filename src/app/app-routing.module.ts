import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reservas',
    loadChildren: () => import('./pages/reservas/reservas.module').then( m => m.ReservasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contabilidad',
    loadChildren: () => import('./pages/facturas/facturas.module').then( m => m.FacturasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'add-reserva',
    loadChildren: () => import('./pages/add-reserva/add-reserva.module').then( m => m.AddReservaPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'add-servicio',
    loadChildren: () => import('./pages/add-servicio/add-servicio.module').then( m => m.AddServicioPageModule)
  },
  {
    path: 'add-servicio/:id',
    loadChildren: () => import('./pages/add-servicio/add-servicio.module').then( m => m.AddServicioPageModule)
  },
  {
    path: 'download-android',
    loadChildren: () => import('./pages/download-android/download-android.module').then( m => m.DownloadAndroidPageModule)
  },
  {
    path: 'download-desktop',
    loadChildren: () => import('./pages/download-desktop/download-desktop.module').then( m => m.DownloadDesktopPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
