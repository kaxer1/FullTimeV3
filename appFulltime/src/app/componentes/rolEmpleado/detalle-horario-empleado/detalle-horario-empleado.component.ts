import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { RegistroDetallePlanHorarioComponent } from 'src/app/componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';


@Component({
  selector: 'app-detalle-horario-empleado',
  templateUrl: './detalle-horario-empleado.component.html',
  styleUrls: ['./detalle-horario-empleado.component.css']
})
export class DetalleHorarioEmpleadoComponent implements OnInit {

  idPlanH: string;
  idEmpleado: string;
  datosPlanificacion: any = [];
  datosDetalle: any = [];

  // items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public router: Router,
    private restDP: DetallePlanHorarioService,
    private restPH: PlanHorarioService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    //console.log('idPlanificacion', aux[2]);
    //console.log('idEmpleado', aux[3]);
    this.idPlanH = aux[2];
    this.idEmpleado = aux[3];
  }

  ngOnInit(): void {
    this.BuscarDatosPlanHorario(this.idPlanH);
    this.ListarDetalles(this.idPlanH);
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  BuscarDatosPlanHorario(id_planificacion: any) {
    this.datosPlanificacion = [];
    this.restPH.ObtenerPlanHorarioPorId(id_planificacion).subscribe(data => {
      this.datosPlanificacion = data;
    })
  }

  ListarDetalles(id_planificacion: any) {
    this.datosDetalle = [];
    this.restDP.ObtenerPlanHoraDetallePorIdPlanHorario(id_planificacion).subscribe(datos => {
      this.datosDetalle = datos;
      for (let i = this.datosDetalle.length - 1; i >= 0; i--) {
        var cadena = this.datosDetalle[i]['tipo_dia'];
        if (cadena === 1) {
          this.datosDetalle[i]['tipo_dia'] = 'Libre';
        }
        else if (cadena === 2) {
          this.datosDetalle[i]['tipo_dia'] = 'Feriado';
        }
        else if (cadena === 3) {
          this.datosDetalle[i]['tipo_dia'] = 'Normal';
        }
      }
      console.log(this.datosDetalle)
    })
  }

  AbrirVentanaDetalles(datosSeleccionados): void {
    this.vistaRegistrarDatos.open(RegistroDetallePlanHorarioComponent, { width: '350px', data: { planHorario: datosSeleccionados, actualizarPage: true, direccionarE: true } })
      .afterClosed().subscribe(item => {
        this.ListarDetalles(this.idPlanH);
      });
  }

  /* AbrirVentanaEditar(datosSeleccionados: any): void {
     console.log(datosSeleccionados);
     this.vistaRegistrarDatos.open(EditarHorarioComponent, { width: '900px', data: { horario: datosSeleccionados, actualizar: true } }).disableClose = true;
   }*/


}
