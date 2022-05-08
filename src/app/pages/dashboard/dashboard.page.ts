import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Reserva } from 'src/app/models/Reserva';
import * as moment from 'moment';
import { LoadingController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public today: string;
  public mes: string;
  public reservasHoy: Reserva[];
  public reservasMes: Reserva[];
  public dineroHoy: number;
  public dineroMensual: number;

  constructor(
    public variables: VariablesService,
    private loading: LoadingService
  ) {
    this.dineroHoy = 0;
    this.dineroMensual = 0;
  }

  async ngOnInit() {
    this.loading.presentLoader('Cargando datos', 3000);
    this.today = moment().format('YYYY-MM-DD');
    this.mes = moment().format('YYYY-MM');
    this.obtenerReservasHoy();
    this.obtenerReservasMes();
  }

  obtenerReservasHoy() {
    setTimeout(() => {
      this.reservasHoy = this.variables.reservas.filter(reserva => reserva.fecha === this.today);
      this.obtenerFacturacionHoy();
    }, 3000);
  }

  obtenerReservasMes() {
    setTimeout(() => {
      this.reservasMes = this.variables.reservas.filter(reserva => reserva.fecha.substring(0,7) === this.mes);
      this.obtenerFacturacionMensual();
    }, 3000);
  }

  obtenerFacturacionHoy() {
    for (const reserva of this.reservasHoy) {
      this.dineroHoy += reserva.precio;
    }
  }

  obtenerFacturacionMensual() {
    for (const reserva of this.reservasMes) {
      this.dineroMensual += reserva.precio;
    }
  }

}
