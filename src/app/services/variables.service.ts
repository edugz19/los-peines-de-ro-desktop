import { Injectable } from '@angular/core';
import { Categoria } from '../models/Categoria';
import { Reserva } from '../models/Reserva';
import { Servicio } from '../models/Servicio';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  reservas: Reserva[];
  servicios: Servicio[];
  categorias: Categoria[];

  constructor() {
    this.reservas = [];
    this.servicios = [];
    this.categorias = [];
  }
}
