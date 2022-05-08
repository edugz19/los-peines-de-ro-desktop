import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserva } from '../models/Reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  reservasCollection: AngularFirestoreCollection<Reserva>;
  reservas: Observable<Reserva[]>;
  reservaDoc: AngularFirestoreDocument<Reserva>;

  constructor(public db: AngularFirestore) {
    this.reservasCollection = this.db.collection('reservas');
    this.reservas = this.reservasCollection.snapshotChanges().pipe(
      map( actions => actions.map( a => {
          const data = a.payload.doc.data() as Reserva;
          data.id = a.payload.doc.id;
          return data;
        }))
    );
  }

  getReservas() {
    return this.reservas;
  }

  getReservaconID(id: string) {
    return this.db.collection<Reserva>('reservas').doc(id).valueChanges();
  }

  createReserva(reserva: Reserva) {
    this.db.collection('reservas').doc(reserva.id).set({
      id: reserva.id,
      uid: reserva.uid,
      nombre: reserva.nombre,
      servicio: reserva.servicio,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      fecha: reserva.fecha,
      precio: reserva.precio,
      pagado: reserva.pagado
    });
  }
}
