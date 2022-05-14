import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Categoria } from '../../models/Categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  p: number;
  public categoriasTemp: Categoria[];
  public sinResultados: boolean;

  constructor(
    public variables: VariablesService
  ) {
    this.p = 1;
    this.sinResultados = false;
    this.categoriasTemp = [];
  }

  ngOnInit() {
  }

  buscarCategoria(event: any, value?: string) {
    let valor;

    if (value === '') {
      valor = '';
    } else {
      valor = event.target.value.toLowerCase();
    }

    if (valor === '') {
      this.categoriasTemp = this.variables.categorias;
      this.sinResultados = false;
    } else {
      this.categoriasTemp = [];
      for (const cat of this.variables.categorias) {
        if (cat.nombre.includes(valor)) {
          this.categoriasTemp.push(cat);
        }
        this.sinResultados = false;
      }

      if (this.categoriasTemp.length === 0) {
        this.sinResultados = true;
      }
    }

    console.log(this.categoriasTemp);
  }

}
