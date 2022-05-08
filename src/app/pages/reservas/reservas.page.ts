import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { Reserva } from 'src/app/models/Reserva';
import * as moment from 'moment';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1,
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'prev,next',
    },
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
    },
    dateClick: (info) => {
      this.selectDay(info.dateStr);
    },
  };

  public reservasDia: Reserva[];
  public today: string;
  public diaSeleccionado: string;

  constructor(public variables: VariablesService) {}

  ngOnInit() {
    moment.locale('es');
    this.today = moment().format('YYYY-MM-DD');
    this.diaSeleccionado = this.today;
    this.selectDay(this.today);
  }

  selectDay(fecha: string) {
    this.diaSeleccionado = fecha;
    this.reservasDia = this.variables.reservas.filter(
      (reserva) => reserva.fecha === fecha
    );

    this.ordenarFechas();

    console.log('Fecha: ', this.today, 'Reservas: ', this.reservasDia);
  }

  ordenarFechas() {
    this.reservasDia.sort((a, b) => {
      const fecha1 = a.fecha + ' ' + a.horaInicio;
      const fecha2 = b.fecha + ' ' + b.horaInicio;

      const fech1 = moment(fecha1, 'YYYY-MM-DD HH:mm').format();
      const fech2 = moment(fecha2, 'YYYY-MM-DD HH:mm').format();

      return new Date(fech1).getTime() - new Date(fech2).getTime();
    });
  }

  parsearDia(fecha: string): string {
    return moment(fecha, 'YYYY-MM-DD').format('LL');
  }
}
