import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonDatetime, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { FESTIVOS } from 'src/app/constants/festivos.const';
import { HORARIO } from 'src/app/constants/horario.const';
import { Reserva } from 'src/app/models/Reserva';
import { Servicio } from 'src/app/models/Servicio';
import { ReservasService } from 'src/app/services/reservas.service';
import { VariablesService } from '../../services/variables.service';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-add-reserva',
  templateUrl: './add-reserva.page.html',
  styleUrls: ['./add-reserva.page.scss'],
})
export class AddReservaPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  public selecCat = true;

  public form = this.fb.group({
    categoria: ['', [Validators.required]],
    servicio: [{ value: '', disabled: true }, [Validators.required]],
    fecha: [{ value: '', disabled: true }, [Validators.required]],
    hora: [{value: '', disabled: true}, [Validators.required]]
  });

  public modoOscuro: boolean;
  public servCat: Servicio[] = [];
  public resetear: string;
  public resetearDate: string;
  public selectServ = false;
  public selectDate = false;
  public servicio: Servicio;
  public ev: any;
  public today: string;
  public horario: Array<string> = HORARIO;
  public festivos: Array<string> = FESTIVOS;
  public horarioInvalido: Array<string> = [];
  public horarioReal: Array<string | any> = [];
  public fechaActual: string;
  public fecha: string;
  public hora = '';
  public horaFin: string;
  public esDiaValido = false;
  public reservas: Reserva[] = [];
  public select: any;
  public horaInvalida = true;
  private reserva: Reserva;

  constructor(
    private reservaSvc: ReservasService,
    public variables: VariablesService,
    public alert: AlertController,
    public loadingController: LoadingController,
    public fb: FormBuilder,
    public router: Router,
    public alerts: AlertsService
  ) {}

  ngOnInit() {
    this.today = moment().format('YYYY-MM-DD');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.modoOscuro = true;
    } else {
      this.modoOscuro = false;
    }
  }

  cargarServicios(ev: any) {
    this.servCat = [];
    this.form.get('fecha').disable();
    this.form.get('hora').disable();
    // this.form.patchValue({
    //   fecha: '',
    //   hora: ''
    // });

    this.servCat = this.variables.servicios.filter(
      (serv) => serv.categoria === ev
    );

    this.form.get('servicio').enable();
  }

  cargarFecha(ev: any) {
    this.servicio = null;
    this.form.get('hora').disable();
    // this.form.patchValue({
    //   fecha: '',
    //   hora: ''
    // });

    if (ev !== '') {
      this.servicio = this.variables.servicios.filter(
        (serv) => serv.id === ev
      )[0];

      this.form.get('fecha').enable();
    }
  }

  comprobarFecha(fecha: any) {
    const duracion = this.servicio.duracion;
    console.log(duracion);
    const dia = moment.weekdays(moment(fecha).day());
    this.horarioReal = [];
    const array = [];
    this.horaInvalida = true;
    this.hora = '';

    if (
      dia === 'Saturday' ||
      dia === 'Sunday' ||
      this.festivos.includes(fecha)
    ) {
      this.esDiaValido = false;
    } else {
      for (const item of this.reservas) {
        if (item.fecha === fecha) {
          const x = this.horario.indexOf(item.horaInicio);
          const y = this.horario.indexOf(item.horaFin);

          for (let i = 0; i < this.horario.length; i++) {
            const horaFin = moment(this.horario[i], 'HH:mm')
              .add(duracion, 'm')
              .format('HH:mm');
            const horaValida = this.comprobarHoraValidaDiaConCitas(
              this.horario[i],
              horaFin,
              item.horaInicio,
              item.horaFin
            );

            // console.log(this.horario[i], horaFin, horaValida);

            if ((i > x && i < y) || !horaValida) {
              array.push(this.horario[i]);
            }
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < this.horario.length; i++) {
            const horaFin = moment(this.horario[i], 'HH:mm')
              .add(duracion, 'm')
              .format('HH:mm');
            const horaValida = this.comprobarHoraValidaDiaSinCitas(
              this.horario[i],
              horaFin
            );

            console.log(this.horario[i], horaFin, horaValida);

            if (!horaValida) {
              array.push(this.horario[i]);
            }
          }
        }
      }

      const dataArr = new Set(array);
      this.horarioInvalido = [...dataArr];
      console.log('Horario Invalido', this.horarioInvalido);

      const newArray = this.horario.concat(this.horarioInvalido);

      console.log('newArray', newArray);

      const uniqueValues = (ar) => [
        ...new Set(
          ar.filter((el) => ar.filter((el2) => el2 === el).length === 1)
        ),
      ];

      this.horarioReal = uniqueValues(newArray);

      console.log('Horario Real Definitivo', this.horarioReal);

      if (this.horarioReal.length > 0) {
        this.esDiaValido = true;
        this.form.get('hora').enable();
      }
    }
  }

  comprobarHoraValidaDiaConCitas(
    horaInicio: string,
    horaFin: string,
    horaInicioCitaExistente: string,
    horaFinCitaExistente: string
  ): boolean {
    if (
      (moment(horaInicio, 'HH:mm') >= moment('09:00', 'HH:mm') &&
        moment(horaFin, 'HH:mm') <= moment('14:00', 'HH:mm')) ||
      (moment(horaInicio, 'HH:mm') >= moment('16:00', 'HH:mm') &&
        moment(horaFin, 'HH:mm') <= moment('20:00', 'HH:mm'))
    ) {
      if (
        moment(horaFin, 'HH:mm') <= moment(horaInicioCitaExistente, 'HH:mm') ||
        moment(horaInicio, 'HH:mm') >= moment(horaFinCitaExistente, 'HH:mm')
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  comprobarHoraValidaDiaSinCitas(horaInicio: string, horaFin: string): boolean {
    if (
      (moment(horaInicio, 'HH:mm') >= moment('09:00', 'HH:mm') &&
        moment(horaFin, 'HH:mm') <= moment('14:00', 'HH:mm')) ||
      (moment(horaInicio, 'HH:mm') >= moment('16:00', 'HH:mm') &&
        moment(horaFin, 'HH:mm') <= moment('20:00', 'HH:mm'))
    ) {
      return true;
    } else {
      return false;
    }
  }

  async crearReserva() {
    moment.locale('es');

    const { fecha, hora } = this.form.value;

    this.horaFin = moment(this.hora, 'HH:mm')
    .add(this.servicio.duracion, 'm')
    .format('HH:mm');

    const nuevaFecha = moment(
      fecha + hora,
      'YYYY-MM-DD HH:mm'
    ).calendar();

    const alert = this.alert.create({
      header: '¿Desea crear la reserva?',
      message: `Se creará una reserva de ${this.servicio.nombre.toUpperCase()} para el ${nuevaFecha}.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
        },
        {
          text: 'Continuar',
          handler: () => {
            const id =
              this.servicio.id + 'lospeinesdero' + fecha + hora;

            this.reserva = {
              id,
              uid: 'lospeinesdero',
              nombre: this.servicio.nombre,
              servicio: this.servicio.id,
              horaInicio: hora,
              horaFin: this.horaFin,
              fecha,
              precio: this.servicio.precio,
              pagado: false,
            };

            console.log(this.reserva);

            this.presentLoading();
            setTimeout(() => {
              this.reservaSvc.createReserva(this.reserva);
              this.alerts.presentToast('La reserva se ha creado correctamente', 'success');
              this.router.navigateByUrl('/reservas');
            }, 2000);
          },
        },
      ],
    });

    return (await alert).present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Realizando reserva...',
      duration: 2000,
    });
    await loading.present();
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
