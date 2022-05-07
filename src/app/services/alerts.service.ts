import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    public toast: ToastController
  ) { }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 2000,
      color
    });
    toast.present();
  }
}
