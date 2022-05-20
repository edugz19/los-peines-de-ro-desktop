import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { VariablesService } from 'src/app/services/variables.service';
import { MessagingService } from '../../services/messaging.service';

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
    public router: Router,
    private variables: VariablesService,
    private reservaSvc: ReservasService,
    private categoriaSvc: CategoriasService,
    private servicioSvc: ServiciosService
  ) { }

  ngOnInit() {
  }

  async login() {
    const { email, pass } = this.loginForm.value;

    try {
      const usuario = await this.authSvc.login(email, pass);
      if (usuario) {
        await this.initializateData();
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

  initializateData(): void {
    this.servicioSvc.getServicios().subscribe( servs => this.variables.servicios = servs );
    this.reservaSvc.getReservas().subscribe( reservas => this.variables.reservas = reservas);
    this.categoriaSvc.getCategorias().subscribe( cats => this.variables.categorias = cats );
  }

}
