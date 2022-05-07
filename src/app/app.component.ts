import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'grid' },
    { title: 'Reservas', url: '/reservas', icon: 'calendar' },
    { title: 'Servicios', url: '/servicios', icon: 'server' },
    { title: 'Facturas', url: '/facturas', icon: 'receipt' },
    { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
  ];

  constructor() {}
}
