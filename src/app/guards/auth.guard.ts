import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public usuario: User;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    this.usuario = await this.authSvc.getUsuarioActual();

    if (!this.usuario) {
      this.router.navigateByUrl('login');
      return false;
    } else {
      return true;
    }
  }

}
