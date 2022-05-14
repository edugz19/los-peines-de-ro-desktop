import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../services/servicios.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Multiplo15 } from '../../helpers/multiplo15';
import { Servicio } from 'src/app/models/Servicio';
import { AlertsService } from '../../services/alerts.service';
import { ServiciosPage } from '../servicios/servicios.page';

@Component({
  selector: 'app-add-servicio',
  templateUrl: './add-servicio.page.html',
  styleUrls: ['./add-servicio.page.scss'],
})
export class AddServicioPage implements OnInit {
  public servicio: Servicio;
  public form = this.fb.group({
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.min(1)]],
    duracion: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(240),
        Multiplo15.multiplo15,
      ],
    ],
  });
  public titulo: string;
  public url: string;
  public submit: string;

  constructor(
    public variables: VariablesService,
    public router: Router,
    public servicioSvc: ServiciosService,
    public fb: FormBuilder,
    public alerts: AlertsService,
    public route: ActivatedRoute,
    public serviciosPage: ServiciosPage
  ) {
    this.url = this.route.snapshot.paramMap.get('id');

    if (this.url === null) {
      this.titulo = 'Añadir servicio';
      this.submit = 'añadirServicio()';
    } else {
      this.titulo = 'Editar servicio';
      this.submit = 'editarServicio()';
      this.servicio = this.variables.servicios.filter(
        (serv) => serv.id === this.url
      )[0];
      this.form.patchValue({
        nombre: this.servicio.nombre,
        categoria: this.servicio.categoria,
        descripcion: this.servicio.descripcion,
        precio: this.servicio.precio,
        duracion: this.servicio.duracion,
      });
    }
  }

  ngOnInit() {}

  crearServicio() {
    const { nombre, categoria, descripcion, precio, duracion } =
      this.form.value;

    const servicioCat = this.variables.servicios.filter(
      (serv) => serv.categoria === categoria
    );
    const numero = Number(servicioCat.length);

    let id;

    if (numero.toString().length === 1) {
      id = categoria + '0' + (numero + 1);
    } else if (numero.toString().length === 2) {
      id = categoria + (numero + 1);
    }

    this.servicio = {
      id,
      nombre,
      categoria,
      descripcion,
      precio,
      duracion,
    };

    this.servicioSvc.addServicio(this.servicio);
    this.alerts.presentToast('Servicio creado correctamente', 'success');
    this.serviciosPage.ngOnInit();
    this.router.navigateByUrl('servicios');
  }

  editarServicio() {
    const { nombre, categoria, descripcion, precio, duracion } =
      this.form.value;

    let id;

    if (this.servicio.categoria !== categoria) {
      const servicioCat = this.variables.servicios.filter(
        (serv) => serv.categoria === categoria
      );
      const numero = Number(servicioCat.length);

      if (numero.toString().length === 1) {
        id = categoria + '0' + (numero + 1);
      } else if (numero.toString().length === 2) {
        id = categoria + (numero + 1);
      }

      this.servicio = {
        id,
        nombre,
        categoria,
        descripcion,
        precio,
        duracion,
      };
    } else {
      id = this.servicio.id;
    }

    this.servicio = {
      id,
      nombre,
      categoria,
      descripcion,
      precio,
      duracion,
    };

    console.log(this.servicio);

    this.servicioSvc.editServicio(this.servicio);
    this.alerts.presentToast('Servicio modificado correctamente', 'success');
    this.serviciosPage.ngOnInit();
    this.router.navigateByUrl('servicios');
  }

  mostrarError(campo: string): string {
    let mensaje = '';

    if (this.form.get(campo)?.errors?.required) {
      mensaje = 'Debes rellenar este campo';
    } else if (this.form.get(campo)?.hasError('max')) {
      mensaje = 'Número invalido. Debe ser menor a 240 minutos.';
    } else if (this.form.get(campo)?.hasError('min')) {
      mensaje = 'Número invalido. Debe ser mayor a 1.';
    } else if (this.form.get('duracion')?.errors?.multiplo15) {
      mensaje =
        'Número inválido. La duración se especifica en tramos de 15 minutos.';
    }

    return mensaje;
  }

  esValido(campo: string): boolean {
    return (
      this.form.get(campo)?.dirty &&
      this.form.get(campo)?.invalid &&
      this.form.get(campo)?.touched
    );
  }
}
