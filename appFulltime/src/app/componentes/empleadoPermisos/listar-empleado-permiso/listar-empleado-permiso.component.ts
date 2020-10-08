import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { AutorizacionesComponent } from 'src/app/componentes/autorizaciones/autorizaciones/autorizaciones.component';

export interface PermisosElemento {
  apellido: string;
  cedula: string;
  descripcion: string;
  docu_nombre: string;
  documento: string;
  estado: string;
  fec_creacion: string;
  fec_final: string;
  fec_inicio: string;
  id: number;
  id_contrato: number;
  id_emple_solicita: number;
  nom_permiso: string;
  nombre: string
}

@Component({
  selector: 'app-listar-empleado-permiso',
  templateUrl: './listar-empleado-permiso.component.html',
  styleUrls: ['./listar-empleado-permiso.component.css']
})
export class ListarEmpleadoPermisoComponent implements OnInit {

  permisos: any = [];

  selectionUno = new SelectionModel<PermisosElemento>(true, []);

  // Habilitar o Deshabilitar el icono de autorización individual
  auto_individual: boolean = true;

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private restP: PermisosService,
    private vistaFlotante: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  obtenerPermisos() {
    this.restP.obtenerAllPermisos().subscribe(res => {
      this.permisos = res;
      console.log(res);
    });
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.permisos.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.permisos.forEach(row => this.selectionUno.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabel(row?: PermisosElemento): string {
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

  AutorizarPermisosMultiple() {
    let EmpleadosSeleccionados;
    EmpleadosSeleccionados = this.selectionUno.selected.map(obj => {
      return {
        id: obj.id,
        empleado: obj.nombre + ' ' + obj.apellido,
        id_contrato: obj.id_contrato,
        id_emple_solicita: obj.id_emple_solicita
      }
    })
    this.AbrirAutorizaciones(EmpleadosSeleccionados, 'multiple');
  }

  // Autorización de horas extras planificadas
  AbrirAutorizaciones(datos_permiso, forma: string) {
    this.vistaFlotante.open(AutorizacionesComponent,
      { width: '600px', data: { datosPermiso: datos_permiso, carga: forma } }).afterClosed().subscribe(items => {
       window.location.reload();
      });
  }

}
