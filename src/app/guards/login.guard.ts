import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  public usuario: User;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    this.usuario = await this.authSvc.getUsuarioActual();

    if (this.usuario) {
      this.router.navigateByUrl(this.router.url);
      return false;
    } else {
      return true;
    }
  }
}
