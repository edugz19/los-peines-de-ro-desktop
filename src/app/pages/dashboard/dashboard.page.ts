import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Reserva } from 'src/app/models/Reserva';
import * as moment from 'moment';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { AddReservaPage } from '../add-reserva/add-reserva.page';
import { Router } from '@angular/router';
import { MessagingService } from 'src/app/services/messaging.service';

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
  public tamanoNumero: string;

  constructor(
    public variables: VariablesService,
    private loading: LoadingService,
    public router: Router,
    private messaging: MessagingService
  ) {
    this.dineroHoy = 0;
    this.dineroMensual = 0;
    this.messaging.requestPermission();
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

    console.log(this.dineroMensual.toFixed(2).toString());

    if (this.dineroMensual.toFixed(2).toString().length === 4) {
      this.tamanoNumero = 'numero5';
    } else if (this.dineroMensual.toFixed(2).toString().length === 5) {
      this.tamanoNumero = 'numero6';
    } else if (this.dineroMensual.toFixed(2).toString().length === 6) {
      this.tamanoNumero = 'numero7';
    } else if (this.dineroMensual.toFixed(2).toString().length === 7) {
      this.tamanoNumero = 'numero8';
    }
  }

}
