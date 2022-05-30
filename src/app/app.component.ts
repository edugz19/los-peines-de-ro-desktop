import { Component } from '@angular/core';
import { CategoriasService } from './services/categorias.service';
import { ReservasService } from './services/reservas.service';
import { ServiciosService } from './services/servicios.service';
import { VariablesService } from './services/variables.service';
import { UsuariosService } from './services/usuarios.service';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

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
    { title: 'Facturas', url: '/facturas', icon: 'receipt' }
  ];

  constructor(
    public variables: VariablesService,
    private reservaSvc: ReservasService,
    private categoriaSvc: CategoriasService,
    private servicioSvc: ServiciosService,
    private usuariosSvc: UsuariosService,
    private remote: AngularFireRemoteConfig
  ) {
    this.initializateData();
  }

  initializateData(): void {
    this.servicioSvc.getServicios().subscribe( servs => this.variables.servicios = servs );
    this.reservaSvc.getReservas().subscribe( reservas => this.variables.reservas = reservas);
    this.categoriaSvc.getCategorias().subscribe( cats => this.variables.categorias = cats );
    this.usuariosSvc.getUsuarios().subscribe( users => this.variables.usuarios = users );
    this.remote.fetchAndActivate().then(() => {
      this.remote.getValue('logo').
      then((blob) => {
        console.log(blob);
        this.variables.imagenBlob = blob.asString();
      });
    });
    console.log('Inicializado');
  }
}
