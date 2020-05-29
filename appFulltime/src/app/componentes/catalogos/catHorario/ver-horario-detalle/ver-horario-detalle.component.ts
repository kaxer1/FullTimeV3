import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { DetalleCatHorarioComponent } from 'src/app/componentes/catalogos/catHorario/detalle-cat-horario/detalle-cat-horario.component';
//import { EditarFeriadosComponent } from 'src/app/componentes/catalogos/catFeriados/editar-feriados/editar-feriados.component';


@Component({
  selector: 'app-ver-horario-detalle',
  templateUrl: './ver-horario-detalle.component.html',
  styleUrls: ['./ver-horario-detalle.component.css']
})
export class VerHorarioDetalleComponent implements OnInit {

  idHorario: string;
  datosHorario: any = [];
  datosDetalle: any = [];

  // items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public router: Router,
    private rest: HorarioService,
    private restD: DetalleCatHorariosService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    this.idHorario = aux[2];
  }

  ngOnInit(): void {
    this.BuscarDatosHorario(this.idHorario);
    this.ListarDetalles(this.idHorario);
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  BuscarDatosHorario(id_horario: any) {
    this.datosHorario = [];
    this.rest.getOneHorarioRest(id_horario).subscribe(data => {
      this.datosHorario = data;
    })
  }

  ListarDetalles(id_horario: any) {
    this.datosDetalle = [];
    this.restD.ConsultarUnDetalleHorario(id_horario).subscribe(datos => {
      this.datosDetalle = datos;
      for (let i = this.datosDetalle.length - 1; i >= 0; i--) {
        var cadena1 = this.datosDetalle[i]['tipo_accion'];
        if (this.datosDetalle[i]['tipo_accion'] === 1) {
          this.datosDetalle[i]['tipo_accion'] = 'Entrada';
        }
        else if (this.datosDetalle[i]['tipo_accion'] === 2) {
          this.datosDetalle[i]['tipo_accion'] = 'Salida';
        }
        else if (this.datosDetalle[i]['tipo_accion'] === 3) {
          this.datosDetalle[i]['tipo_accion'] = 'S.Almuerzo';
        }
        else if (this.datosDetalle[i]['tipo_accion'] === 4) {
          this.datosDetalle[i]['tipo_accion'] = 'E. Almuerzo';
        }
      }
      console.log(this.datosDetalle)
    })
  }

  AbrirVentanaDetalles(datosSeleccionados): void {
    this.vistaRegistrarDatos.open(DetalleCatHorarioComponent, { width: '600px', data: { datosHorario: datosSeleccionados, actualizar: true } }).disableClose = true;
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    /*this.vistaRegistrarDatos.open(EditarFeriadosComponent, { width: '400px', data: { datosFeriado: datosSeleccionados, actualizar: true} }).disableClose = true;
    console.log(datosSeleccionados.fecha);*/
  }

}
