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
    { title: 'Facturas', url: '/facturas', icon: 'receipt' }
  ];

  constructor(
    public menuCtrl: MenuController,
    private authSvc: AuthService,
    private router: Router
  ) { }

  ngOnInit() {}

  logout() {
    this.authSvc.logout();
    window.location.href = 'login';
  }

}
