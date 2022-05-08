import { Component, OnInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    public variables: VariablesService
  ) { }

  ngOnInit() {}

}
