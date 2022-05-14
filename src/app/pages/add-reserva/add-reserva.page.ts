import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonDatetime,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import * as moment from 'moment';
import { FESTIVOS } from 'src/app/constants/festivos.const';
import { HORARIO } from 'src/app/constants/horario.const';
import { Reserva } from 'src/app/models/Reserva';
import { Servicio } from 'src/app/models/Servicio';
import { ReservasService } from 'src/app/services/reservas.service';
import { VariablesService } from '../../services/variables.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-reserva',
  templateUrl: './add-reserva.page.html',
  styleUrls: ['./add-reserva.page.scss'],
})
export class AddReservaPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  public modoOscuro: boolean;
  public selecCat = false;
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
    public modalCtrl: ModalController,
    private reservaSvc: ReservasService,
    public variables: VariablesService,
    public alert: AlertController,
    public loadingController: LoadingController
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

  cerrarModal() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  cargarServicios(ev: any) {
    this.servCat = [];
    this.servCat = this.variables.servicios.filter(
      (serv) => serv.categoria === ev.detail.value
    );
    this.selecCat = true;
    this.selectServ = false;
    this.selectDate = false;
    this.resetear = null;
    this.resetearDate = null;
    this.horarioReal = [];
  }

  cargarFecha(ev: any) {
    this.servicio = null;
    if (ev.detail.value !== '') {
      this.servicio = this.variables.servicios.filter(
        (serv) => serv.id === ev.detail.value
      )[0];
      console.log(this.servicio);
      this.selectServ = true;
      this.selectDate = false;
      this.resetearDate = null;
    }
    this.horarioReal = [];
  }

  cargarHorario(ev: any) {
    const fecha = ev.detail.value;
    this.comprobarFecha(fecha, this.servicio.duracion);
    this.selectDate = true;
  }

  comprobarFecha(fecha: any, duracion: number) {
    this.fecha = fecha;
    const dia = moment.weekdays(moment(fecha).day());
    this.select = null;
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

            // console.log(this.horario[i], horaFin, horaValida);

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

  seleccionaHora(ev: any, duracion: number) {
    this.hora = ev.target.value;
    this.horaFin = moment(this.hora, 'HH:mm')
      .add(duracion, 'm')
      .format('HH:mm');
    this.horaInvalida = false;
  }

  async crearReserva() {
    moment.locale('es');

    const nuevaFecha = moment(
      this.fecha + this.hora,
      'YYYY-MM-DD HH:mm'
    ).calendar();

    const alert = this.alert.create({
      header: '¿Desea crear la reserva?',
      message: `Se creará una reserva de ${this.servicio.nombre.toUpperCase()} para el ${nuevaFecha}.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel'
        },
        {
          text: 'Continuar',
          handler: () => {
            const id = this.servicio.id + 'lospeinesdero' + this.fecha + this.hora;

            this.reserva = {
              id,
              uid: 'lospeinesdero',
              nombre: this.servicio.nombre,
              servicio: this.servicio.id,
              horaInicio: this.hora,
              horaFin: this.horaFin,
              fecha: this.fecha,
              precio: this.servicio.precio,
              pagado: false,
            };

            console.log(this.reserva);

            this.presentLoading();
            setTimeout(() => {
              this.reservaSvc.createReserva(this.reserva);
              this.reservaSvc.getReservas().subscribe(res => this.variables.reservas = res);
              this.modalCtrl.dismiss({
                dismissed: true,
              });
              this.variables.reservas = [];
            }, 4000);
          }
        }
      ]
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
}
