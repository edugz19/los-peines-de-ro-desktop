import { Component, OnInit } from '@angular/core';
import { Servicio } from 'src/app/models/Servicio';
import { VariablesService } from '../../services/variables.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {
  p: number;
  public serviciosTemp: Servicio[];
  public sinResultados: boolean;

  constructor(public variables: VariablesService) {
    this.p = 1;
    this.serviciosTemp = [];
    this.sinResultados = false;
  }

  ngOnInit() {}

  getHoras(min: number): string {
    let duracion: string;

    if (min >= 60) {
      const h = Math.floor(min / 60);

      if (min % 60 === 0) {
        duracion = `${h}h`;
      } else {
        const m = min % 60;
        duracion = `${h}h ${m}min`;
      }
    } else {
      duracion = `${min}min`;
    }

    return duracion;
  }

  buscarServicio(event: any, value?: string) {
    let valor;

    if (value === '') {
      valor = '';
    } else {
      valor = event.target.value.toLowerCase();
    }

    const input = document.getElementById('select') as HTMLSelectElement;
    input.value = '00';

    if (valor === '') {
      this.serviciosTemp = this.variables.servicios;
      this.sinResultados = false;
    } else {
      this.serviciosTemp = [];
      for (const servicio of this.variables.servicios) {
        if (servicio.nombre.includes(valor)) {
          this.serviciosTemp.push(servicio);
        }
        this.sinResultados = false;
      }

      if (this.serviciosTemp.length === 0) {
        this.sinResultados = true;
      }
    }

    console.log(this.serviciosTemp);
  }

  buscarCategoria(event: any) {
    this.sinResultados = false;
    const valor = event.detail.value;
    const input = document.getElementById('search') as HTMLInputElement;
    input.value = '';

    if (valor === '00') {
      this.serviciosTemp = this.variables.servicios;
    } else {
      this.serviciosTemp = [];

      for (const servicio of this.variables.servicios) {
        if (servicio.categoria === valor) {
          this.serviciosTemp.push(servicio);
        }
      }
    }

    console.log(this.serviciosTemp);
  }
}
