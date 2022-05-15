import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../models/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  categoriasCollection: AngularFirestoreCollection<Categoria>;
  categorias: Observable<Categoria[]>;
  categoriaDoc: AngularFirestoreDocument<Categoria>;

  constructor(public db: AngularFirestore) {
    this.categoriasCollection = this.db.collection('categorias');
    this.categorias = this.categoriasCollection.snapshotChanges().pipe(
      map( actions => actions.map( a => {
          const data = a.payload.doc.data() as Categoria;
          data.id = a.payload.doc.id;
          return data;
        }))
    );
  }

  getCategorias() {
    return this.categorias;
  }

  getCategoriaconID(id: string) {
    return this.db.collection<Categoria>('categorias').doc(id).valueChanges();
  }

  addCategoria(cat: Categoria) {
    this.db.collection('categorias').doc(cat.id).set(cat);
  }

  editCategoria(cat: Categoria) {
    this.db.collection('categorias').doc(cat.id).update(cat);
  }

  deleteCategoria(id: string) {
    this.db.collection('categorias').doc(id).delete();
  }
}
