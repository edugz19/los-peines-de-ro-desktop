import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servicio } from '../models/Servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  serviciosCollection: AngularFirestoreCollection<Servicio>;
  servicios: Observable<Servicio[]>;
  servicioDoc: AngularFirestoreDocument<Servicio>;

  constructor(public db: AngularFirestore) {
    this.serviciosCollection = this.db.collection('servicios');
    this.servicios = this.serviciosCollection.snapshotChanges().pipe(
      map( actions => actions.map( a => {
          const data = a.payload.doc.data() as Servicio;
          data.id = a.payload.doc.id;
          return data;
        }))
    );
  }

  getServicios() {
    return this.servicios;
  }

  getServicioconID(id) {
    return this.db.collection<Servicio>('servicios').doc(id).valueChanges();
  }

  addServicio(servicio: Servicio) {
    this.db.collection('servicios').doc(servicio.id).set(servicio);
  }

  editServicio(servicio: Servicio) {
    this.db.collection('servicios').doc(servicio.id).update(servicio);
  }

  deleteServicio(id: string) {
    this.db.collection('servicios').doc(id).delete();
  }
}
