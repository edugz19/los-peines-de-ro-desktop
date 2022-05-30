import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'grid' },
    { title: 'Reservas', url: '/reservas', icon: 'calendar' },
    { title: 'Servicios', url: '/servicios', icon: 'server' },
    { title: 'Categorías', url: '/categorias', icon: 'list' },
    { title: 'Facturación', url: '/contabilidad', icon: 'logo-euro' }
  ];
  public modoOscuro: boolean;

  constructor(
    public menuCtrl: MenuController,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.modoOscuro = true;
    } else {
      this.modoOscuro = false;
    }
  }

  logout() {
    this.authSvc.logout();
  }

}
