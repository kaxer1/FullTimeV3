import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { PlanHoraExtraService } from 'src/app/servicios/planHoraExtra/plan-hora-extra.service';
import { TiempoAutorizadoComponent } from 'src/app/componentes/horasExtras/tiempo-autorizado/tiempo-autorizado.component';
import { PlanHoraExtraAutorizaComponent } from 'src/app/componentes/autorizaciones/plan-hora-extra-autoriza/plan-hora-extra-autoriza.component';


@Component({
  selector: 'app-lista-plan-hora-extra',
  templateUrl: './lista-plan-hora-extra.component.html',
  styleUrls: ['./lista-plan-hora-extra.component.css']
})
export class ListaPlanHoraExtraComponent implements OnInit {

  horas_extras_plan: any = [];

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Variable para habilitar o deshabilitar el componente para ver tiempo de horas extras
  HabilitarTiempo: boolean = false;

  // Habilitar o deshabilitar selector de empleados
  Habilitar: boolean = true;

  habilitado: any;

  constructor(
    private restHEP: PlanHoraExtraService,
    private vistaFlotante: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerPlanHorasExtras();
  }

  // Evento para manejar paginación
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Lista de empleados que han realizado horas extras planificadas
  obtenerPlanHorasExtras() {
    this.restHEP.ConsultarPlanHoraExtra().subscribe(res => {
      this.horas_extras_plan = res;
      console.log(this.horas_extras_plan);
    });
  }

  // Autorizar horas realizadas o indicar cuantas horas se autorizan
  AbrirTiempoAutorizacion(num_hora, id, datos) {
    let h = {
      id: id,
      hora: num_hora
    }
    this.vistaFlotante.open(TiempoAutorizadoComponent, {
      width: '250px',
      data: { horas_calculadas: h, pagina: 'plan_hora_extra' }
    }).afterClosed().subscribe(items => {
      this.AbrirAutorizaciones(datos, 'individual');
    });
  }

  // Autorización individual de horas extras planificadas
  AbrirAutorizaciones(datosHoraExtra, forma: string) {
    this.vistaFlotante.open(PlanHoraExtraAutorizaComponent,
      { width: '300px', data: { datosHora: datosHoraExtra, carga: forma } }).afterClosed().subscribe(items => {
        this.obtenerPlanHorasExtras();
      });
  }

  // Autorización multiple de horas extras planificadas
  AutorizarHoras() {
    for (var i = 0; i <= this.empleadosSeleccionados.length - 1; i++) {
      let h = {
        hora: this.empleadosSeleccionados[i].hora_total_timbre
      }
      this.restHEP.AutorizarTiempoHoraExtra(this.empleadosSeleccionados[i].id_plan_extra, h).subscribe(res => {
      })
    }
    this.AbrirAutorizaciones(this.empleadosSeleccionados, 'multiple');
    this.habilitado = { 'visibility': 'visible' };
    this.Habilitar = true;
    (<HTMLInputElement>document.getElementById('selecTodo')).checked = false;
    this.obtenerPlanHorasExtras();
  }

  // Arreglos para guardar empleados seleccionadas
  empleadosSeleccionados = [];

  AgregarEmpleado(data: string) {
    this.empleadosSeleccionados.push(data);
  }

  QuitarEmpleado(data) {
    this.empleadosSeleccionados = this.empleadosSeleccionados.filter(s => s !== data);
  }

  // Agregar datos multiples seleccionados
  AgregarTodos() {
    this.Habilitar = false;
    if (this.empleadosSeleccionados.length === 0) {
      this.empleadosSeleccionados = this.horas_extras_plan;
    }
    else {
      this.empleadosSeleccionados = this.empleadosSeleccionados.concat(this.horas_extras_plan);
    }
    for (var i = 0; i <= this.tamanio_pagina - 1; i++) {
      if ((<HTMLInputElement>document.getElementById('empleadosSeleccionados' + i))) {
        (<HTMLInputElement>document.getElementById('empleadosSeleccionados' + i)).checked = true;
      }
    }
    this.Habilitar = false;
    this.habilitado = { 'visibility': 'hidden' };
    console.log('empleados', this.empleadosSeleccionados);
  }

  // Quitar todos los datos seleccionados 
  limpiarData: any = [];
  QuitarTodos() {
    this.limpiarData = this.horas_extras_plan;
    for (var i = 0; i <= this.limpiarData.length - 1; i++) {
      this.empleadosSeleccionados = this.empleadosSeleccionados.filter(s => s !== this.horas_extras_plan[i]);
    }
    for (var i = 0; i <= this.tamanio_pagina - 1; i++) {
      if ((<HTMLInputElement>document.getElementById('empleadosSeleccionados' + i))) {
        (<HTMLInputElement>document.getElementById('empleadosSeleccionados' + i)).checked = false;
      }
    }
    this.habilitado = { 'visibility': 'visible' };
    this.Habilitar = true;
  }

}
