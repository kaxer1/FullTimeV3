import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

@Component({
  selector: 'app-lista-pedido-hora-extra',
  templateUrl: './lista-pedido-hora-extra.component.html',
  styleUrls: ['./lista-pedido-hora-extra.component.css']
})
export class ListaPedidoHoraExtraComponent implements OnInit {

  horas_extras: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private restHE: PedHoraExtraService
  ) { }

  ngOnInit(): void {
    this.obtenerHorasExtras();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  obtenerHorasExtras(){
    this.restHE.ListaAllHoraExtra().subscribe(res => {
      this.horas_extras = res;
      console.log(res);
    });
  }
}
