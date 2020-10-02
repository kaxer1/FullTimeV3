import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { TiempoAutorizadoComponent } from 'src/app/componentes/horasExtras/tiempo-autorizado/tiempo-autorizado.component';
import { HoraExtraAutorizacionesComponent } from 'src/app/componentes/autorizaciones/hora-extra-autorizaciones/hora-extra-autorizaciones.component';

export interface HoraExtraElemento {
  apellido: string;
  descripcion: string;
  estado: string;
  fec_final: string;
  fec_inicio: string;
  fec_solicita: string;
  id: number;
  nombre: string;
  num_hora: string;
  id_empl_cargo: number;
  id_contrato: number;
  id_usua_solicita: number;
}

@Component({
  selector: 'app-lista-pedido-hora-extra',
  templateUrl: './lista-pedido-hora-extra.component.html',
  styleUrls: ['./lista-pedido-hora-extra.component.css']
})

export class ListaPedidoHoraExtraComponent implements OnInit {

  horas_extras: any = [];

  selectionUno = new SelectionModel<HoraExtraElemento>(true, []);

  // Habilitar o Deshabilitar el icono de autorización individual
  auto_individual: boolean = true;

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private restHE: PedHoraExtraService,
    private vistaFlotante: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtenerHorasExtras();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  obtenerHorasExtras() {
    this.restHE.ListaAllHoraExtra().subscribe(res => {
      this.horas_extras = res;
      for (var i = 0; i <= this.horas_extras.length - 1; i++) {
        if (this.horas_extras[i].estado === 1) {
          this.horas_extras[i].estado = 'Pendiente';
        }
        else if (this.horas_extras[i].estado === 2) {
          this.horas_extras[i].estado = 'Pre-Autorizado';
        }
        else if (this.horas_extras[i].estado === 3) {
          this.horas_extras[i].estado = 'Autorizado';
        }
        else if (this.horas_extras[i].estado === 4) {
          this.horas_extras[i].estado = 'Negado';
        }
      }
      console.log(res);
    });
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.horas_extras.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.horas_extras.forEach(row => this.selectionUno.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabel(row?: HoraExtraElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUno.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  btnCheckHabilitar: boolean = false;
  HabilitarSeleccion() {
    if (this.btnCheckHabilitar === false) {
      this.btnCheckHabilitar = true;
      this.auto_individual = false;
    } else if (this.btnCheckHabilitar === true) {
      this.btnCheckHabilitar = false;
      this.auto_individual = true;
    }
  }

  AutorizarHorasExtrasMultiple() {
    let EmpleadosSeleccionados;
    EmpleadosSeleccionados = this.selectionUno.selected.map(obj => {
      return {
        id: obj.id,
        empleado: obj.nombre + ' ' + obj.apellido,
        num_hora: obj.num_hora,
        id_contrato: obj.id_contrato,
        id_usua_solicita: obj.id_usua_solicita
      }
    })
    for (var i = 0; i <= EmpleadosSeleccionados.length - 1; i++) {
      let h = {
        hora: EmpleadosSeleccionados[i].num_hora
      }
      this.restHE.AutorizarTiempoHoraExtra(EmpleadosSeleccionados[i].id, h).subscribe(res => {
        console.log(res);
      })
    }
    this.AbrirAutorizaciones(EmpleadosSeleccionados, 'multiple');
  }

  // Autorización de horas extras planificadas
  AbrirAutorizaciones(datosHoraExtra, forma: string) {
    this.vistaFlotante.open(HoraExtraAutorizacionesComponent,
      { width: '300px', data: { datosHora: datosHoraExtra, carga: forma } }).afterClosed().subscribe(items => {
        window.location.reload();
      });
  }


}
