import { Injectable } from '@angular/core';
import { Categoria } from '../models/Categoria';
import { Reserva } from '../models/Reserva';
import { Servicio } from '../models/Servicio';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  reservas: Reserva[];
  servicios: Servicio[];
  categorias: Categoria[];
  usuarios: Usuario[];
  public imagenBlob: string;

  constructor() {
    this.reservas = [];
    this.servicios = [];
    this.categorias = [];
    this.usuarios = [];
    this.imagenBlob = '';
  }
}
