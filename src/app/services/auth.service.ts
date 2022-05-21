import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertsService } from './alerts.service';

import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private alert: AlertsService,
    private router: Router
  ) { }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;

    } catch (error) {
      this.alert.presentToast('El correo electrónico o la contraseña son incorrectos', 'danger');
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigateByUrl('/login');
  }

  getUsuarioActual() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }
}
