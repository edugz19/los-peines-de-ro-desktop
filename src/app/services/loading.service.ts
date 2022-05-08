import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    public loading: LoadingController
  ) { }

  async presentLoader(message: string, duration: number) {
    const loading = await this.loading.create({
      message,
      duration
    });

    await loading.present();
  }
}
