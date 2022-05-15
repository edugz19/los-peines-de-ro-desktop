import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Categoria } from '../../models/Categoria';
import { CategoriasService } from '../../services/categorias.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from '../../services/alerts.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  p: number;
  public categoriasTemp: Categoria[];
  public sinResultados: boolean;
  public form = this.fb.group({
    nombre: ['', [Validators.required]],
  });
  public addCat: boolean;
  public categoria: Categoria;

  constructor(
    public variables: VariablesService,
    public catSvc: CategoriasService,
    public fb: FormBuilder,
    public alerts: AlertsService,
    public alert: AlertController
  ) {
    this.p = 1;
    this.sinResultados = false;
    this.categoriasTemp = [];
    this.addCat = false;
  }

  ngOnInit() {}

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

  addCategoria() {
    const { nombre } = this.form.value;
    const pos = this.variables.categorias.length - 1;
    const lastCat = this.variables.categorias[pos];
    const id = Number(lastCat.id) + 1;

    this.categoria = {
      id: id.toString(),
      nombre
    };

    this.catSvc.addCategoria(this.categoria);
    this.form.patchValue({
      nombre: ''
    });
    this.addCat = false;
    this.alerts.presentToast('La categoría se ha añadido correctamente', 'success');
    this.ngOnInit();
  }

  borrarCat(id: string) {
    this.presentAlert(id);
  }

  async presentAlert(id: string) {
    const alert = await this.alert.create({
      header: 'Borrar Categoría',
      message: '¿Está seguro de que quiere borrar esta categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            this.catSvc.deleteCategoria(id);
            this.alerts.presentToast(
              'Categoría borrada correctamente',
              'success'
            );

            this.ngOnInit();
          },
        },
      ],
    });

    await alert.present();
  }
}
