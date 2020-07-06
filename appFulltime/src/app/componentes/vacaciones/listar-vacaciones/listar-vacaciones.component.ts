import { Component, OnInit } from '@angular/core';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listar-vacaciones',
  templateUrl: './listar-vacaciones.component.html',
  styleUrls: ['./listar-vacaciones.component.css']
})
export class ListarVacacionesComponent implements OnInit {

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  vacaciones: any = [];

  constructor(
    private restV: VacacionesService
  ) { }

  ngOnInit(): void {
    this.restV.ObtenerListaVacaciones().subscribe(res => {
      this.vacaciones = res;
      console.log(res);
    });
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }
}
