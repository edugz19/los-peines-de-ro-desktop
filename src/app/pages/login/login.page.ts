import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ocultarPass = true;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async login() {
    const { email, pass } = this.loginForm.value;

    try {
      const usuario = await this.authSvc.login(email, pass);
      if (usuario) {
        this.router.navigateByUrl('dashboard');
      }

    } catch(error) {
      // console.log(error);
    }
  }

  mostrarError(campo: string): string {
    let mensaje = '';

    if (this.loginForm.get(campo)?.errors?.required) {
      mensaje = 'Debes rellenar este campo';
    } else if (this.loginForm.get(campo)?.hasError('email')) {
      mensaje = 'Email inválido';
    }

    return mensaje;
  }

  esValido(campo: string): boolean {
    return (
      this.loginForm.get(campo)?.dirty &&
      this.loginForm.get(campo)?.invalid
    );
  }

}
