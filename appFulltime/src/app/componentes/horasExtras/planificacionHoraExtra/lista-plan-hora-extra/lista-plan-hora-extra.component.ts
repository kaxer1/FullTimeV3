import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { PlanHoraExtraService } from 'src/app/servicios/planHoraExtra/plan-hora-extra.service';
import { TiempoAutorizadoComponent } from 'src/app/componentes/horasExtras/tiempo-autorizado/tiempo-autorizado.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lista-plan-hora-extra',
  templateUrl: './lista-plan-hora-extra.component.html',
  styleUrls: ['./lista-plan-hora-extra.component.css']
})
export class ListaPlanHoraExtraComponent implements OnInit {

  horas_extras_plan: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Variable para habilitar o deshabilitar el componente para ver tiempo de horas extras
  HabilitarTiempo: boolean = false;

  constructor(
    private restHEP: PlanHoraExtraService,
    private vistaFlotante: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerPlanHorasExtras();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  obtenerPlanHorasExtras() {
    this.restHEP.ConsultarPlanHoraExtra().subscribe(res => {
      this.horas_extras_plan = res;
      console.log(this.horas_extras_plan);
    });
  }

  AbrirTiempoAutorizacion(num_hora, id) {
    let h = {
      id: id,
      hora: num_hora
    }
    this.vistaFlotante.open(TiempoAutorizadoComponent, {
      width: '250px',
      data: { horas_calculadas: h, pagina: 'plan_hora_extra' }
    }).afterClosed().subscribe(items => {
      this.obtenerPlanHorasExtras();
    });
  }

}
