/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(
    private afMessaging: AngularFireMessaging,
    private http: HttpClient
  ) { }

  requestPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => {
          console.log(token);
        },
        (error) => { console.log(error); }
    );
  }
}
