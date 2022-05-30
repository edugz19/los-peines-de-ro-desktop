import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { Reserva } from 'src/app/models/Reserva';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { ReservasService } from '../../services/reservas.service';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../../app.component';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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

  public ref: AngularFireStorageReference;
  public afTask: AngularFireUploadTask;

  constructor(
    public variables: VariablesService,
    public resSvc: ReservasService,
    public router: Router,
    public usuariosSvc: UsuariosService,
    public alert: AlertController,
    public app: AppComponent,
    public storage: AngularFireStorage,
  ) {}

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

  obtenerNombreUsuario(uid: string): string {
    if (uid === 'lospeinesdero') {
      return uid;
    }

    for (const user of this.variables.usuarios) {
      if (user.uid === uid) {
        return user.displayName;
      }
    }
  }

  async completarReserva(reserva: Reserva) {
    const alert = this.alert.create({
      header: 'Completar reserva',
      message:
        'La reserva será completada y se generará el comprobante. ¿Desea continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
        },
        {
          text: 'Continuar',
          handler: () => {
            reserva.completada = true;
            reserva.pagado = true;
            this.resSvc.updateReserva(reserva);

            this.generarTicket(reserva);
          },
        },
      ],
    });

    return (await alert).present();
  }

  async borrarReserva(id: string) {
    const alert = this.alert.create({
      header: '¿Desea borrar la reserva?',
      message: 'No podrá deshacer los cambios. ¿Quiere continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.resSvc.deleteReserva(id);
            this.reservasDia = this.reservasDia.filter((res) => id !== res.id);
            console.log(this.reservasDia);
          },
        },
      ],
    });

    return (await alert).present();
  }

  generarTicket(reserva: Reserva) {
    let pagado: string;
    let cantidad: number;
    const fecha = moment().format('DD/MM/YYYY');
    const hora = moment().format('HH:mm');

    if (reserva.pagado) {
      pagado = 'SI';
      cantidad = 0;
    } else {
      pagado = 'NO';
      cantidad = reserva.precio;
    }

    const dd = {
      pageSize: 'A6',
      content: [
        // Header
        {
          columns: [
            [
              {
                text: 'DETALLES DEL SERVICIO',
                style: 'invoiceTitle',
                width: '*',
              },
            ],
          ],
        },
        {
          columns: [
            {
              image: this.variables.imagenBlob,
              style: 'imagen',
              // alignment: 'center',
              width: 80,
            },
          ],
        },
        {
          columns: [
            {
              text: 'Datos de la reserva',
              style: 'invoiceBillingTitle1',
            },
          ],
        },
        {
          columns: [
            {
              text: 'Empleado: 1' + '\nPagado online: ' + pagado,
              style: 'invoiceBillingAddress1',
            },
            {
              text: 'Hora: ' + hora + '\nFecha: ' + fecha,
              style: 'invoiceBillingAddress1',
            },
          ],
        },
        {
          columns: [
            {
              text: 'Servicio: ' + reserva.nombre.toUpperCase(),
              style: 'invoiceBillingAddress2',
            },
          ],
        },
        // TOTAL
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths: ['*', 80],
            body: [
              // Total
              [
                {
                  text: 'Subtotal',
                  style: 'itemsFooterSubTitle',
                },
                {
                  text: (reserva.precio * 0.79).toFixed(2) + '€',
                  style: 'itemsFooterSubValue',
                },
              ],
              [
                {
                  text: 'IVA 21%',
                  style: 'itemsFooterSubTitle',
                },
                {
                  text: (reserva.precio * 0.21).toFixed(2) + '€',
                  style: 'itemsFooterSubValue',
                },
              ],
              [
                {
                  text: 'TOTAL',
                  style: 'itemsFooterTotalTitle',
                },
                {
                  text: reserva.precio.toFixed(2) + '€',
                  style: 'itemsFooterTotalValue',
                },
              ],
              [
                {
                  text: 'TOTAL A PAGAR',
                  style: 'itemsFooterTotalTitle',
                },
                {
                  text: cantidad.toFixed(2) + '€',
                  style: 'itemsFooterTotalValue',
                },
              ],
            ],
          }, // table
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        invoiceTitle: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 15],
        },
        imagen: {
          margin: [0, 0, 0, 15],
        },
        // Billing Headers
        invoiceBillingTitle1: {
          fontSize: 12,
          bold: true,
          alignment: 'left',
          margin: [0, 5, 0, 0],
        },
        invoiceBillingAddress1: {
          fontSize: 10,
          margin: [0, 5, 0, 0],
          lineHeight: 1.2,
        },
        invoiceBillingAddress2: {
          fontSize: 10,
          margin: [0, 0, 0, 0],
          lineHeight: 1.2,
        },
        // Items Footer (Subtotal, Total, Tax, etc)
        itemsFooterSubTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'left',
        },
        itemsFooterSubValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right',
        },
        itemsFooterTotalTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'left',
        },
        itemsFooterTotalValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right',
        },
        center: {
          alignment: 'center',
        },
      },
    };

    const pdf = pdfMake.createPdf(dd);

    pdf.getBlob((blob) => {
      console.log(blob);
      const filePath = `tickets/${reserva.id}.pdf`;
      this.ref = this.storage.ref(filePath);
      this.afTask = this.ref.put(blob);

      setTimeout(() => {
        this.ref.getDownloadURL().subscribe( url => {
          reserva.urlTicket = url;
          this.resSvc.updateReserva(reserva);
        });
      }, 2000);
    });
  }

  verFactura(reserva: Reserva) {
    if(reserva.urlTicket !== undefined) {
      window.open(reserva.urlTicket, '_blank');
    }
  }
}
