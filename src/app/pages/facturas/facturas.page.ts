import { Component, OnInit } from '@angular/core';
import { VariablesService } from 'src/app/services/variables.service';
import * as moment from 'moment';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {
  public chart: any;
  public meses = [];
  public dias = [];
  public anios = [];
  public reservasDias = [];
  public reservasMes = [];
  public reservasAnual = [];
  public dataMensual = [];
  public dataSemanal = [];
  public dataAnual = [];
  public segment: string;

  constructor(
    public variables: VariablesService
  ) {
    moment.locale('es');
    this.segment = 'semanal';
  }

  ngOnInit() {
    this.obtenerDatosMensuales();
    this.obtenerDatosAnuales();
    this.obtenerDatosSemanales();
    this.crearGrafica();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    this.chart.clear();
    this.chart.destroy();
    this.crearGrafica();
  }

  crearGrafica() {
    let labels;
    let label;
    let data;
    let backgroundColor;
    let borderColor;

    if (this.segment === 'semanal') {
      labels = this.dias;
      data = this.dataSemanal;
      label = 'Facturación semanal de los últimos 5 días';
      backgroundColor = 'rgba(138,221,45,0.3)';
      borderColor = 'rgba(138,221,45,0.8)';
    }

    if (this.segment === 'mensual') {
      labels = this.meses;
      data = this.dataMensual;
      label = 'Facturación mensual de los últimos 12 meses';
      backgroundColor = 'rgba(230,43,21,0.3)';
      borderColor = 'rgba(230,43,21,0.8)';
    }

    if (this.segment === 'anual') {
      labels = this.anios;
      data = this.dataAnual;
      label = 'Facturación anual de los últimos 5 años';
      backgroundColor = 'rgba(45,34,230,0.3)';
      borderColor = 'rgba(45,34,230,0.8)';
    }


    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: [
              backgroundColor
            ],
            borderColor: [
              borderColor
            ],
            borderWidth: 3,
          },
        ],
      },
      options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    });
  }

  obtenerDatosSemanales() {
    for (let i = 6; i >= 0; i--) {
      const dia = moment().subtract(i, 'days');
      if (dia.format('dddd') === 'sábado' || dia.format('dddd') === 'domingo') {
        console.log('Fin de semana');
      } else {
        this.dias.push(dia.format('dddd').toUpperCase());
        this.reservasDias.push(dia.format('YYYY-MM-DD'));
      }
    }

    for (const dia of this.reservasDias) {
      const array = this.variables.reservas.filter( reserva => reserva.fecha === dia);
      let cantidad = 0;

      if (array.length > 0) {
        for (const item of array) {
          cantidad += item.precio;
        }
      }

      this.dataSemanal.push(cantidad);
    }

    console.log('Data Semanal', this.dataSemanal);
  }

  obtenerDatosMensuales() {
    for (let i = 11; i >= 0; i--) {
      const mes = moment().subtract(i, 'month');
      this.meses.push(mes.format('MMMM').toUpperCase());
      this.reservasMes.push(mes.format('YYYY-MM'));
    }

    for (const mes of this.reservasMes) {
      const array = this.variables.reservas.filter( reserva => reserva.fecha.substring(0,7) === mes);
      let cantidad = 0;

      if (array.length > 0) {
        for (const item of array) {
          cantidad += item.precio;
        }
      }

      this.dataMensual.push(cantidad);
    }

  }

  obtenerDatosAnuales() {
    for (let i = 4; i >= 0; i--) {
      const anio = moment().subtract(i, 'year').format('YYYY');
      this.anios.push(anio);
      this.reservasAnual.push(anio);
    }

    for (const anio of this.reservasAnual) {
      const array = this.variables.reservas.filter( reserva => reserva.fecha.substring(0, 4) === anio);
      let cantidad = 0;

      if (array.length > 0) {
        for (const item of array) {
          cantidad += item.precio;
        }
      }

      this.dataAnual.push(cantidad);
    }
  }
}
