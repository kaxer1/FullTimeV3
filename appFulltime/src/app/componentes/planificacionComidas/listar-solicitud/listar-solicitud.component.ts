import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { AutorizacionesComponent } from 'src/app/componentes/autorizaciones/autorizaciones/autorizaciones.component';
import { EditarPermisoEmpleadoComponent } from '../../rolEmpleado/solicitar-permisos-empleado/editar-permiso-empleado/editar-permiso-empleado.component';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';


export interface PermisosElemento {
  apellido: string;
  cedula: string;
  descripcion: string;
  docu_nombre: string;
  documento: string;
  estado: number;
  fec_creacion: string;
  fec_final: string;
  fec_inicio: string;
  id: number;
  id_contrato: number;
  id_emple_solicita: number;
  nom_permiso: string;
  nombre: string,
  id_empl_cargo: number,
}

@Component({
  selector: 'app-listar-solicitud',
  templateUrl: './listar-solicitud.component.html',
  styleUrls: ['./listar-solicitud.component.css']
})


export class ListarSolicitudComponent implements OnInit {

  solicitudes: any = [];

  selectionUno = new SelectionModel<PermisosElemento>(true, []);

  // Visibilizar lista de permisos autorizados
  lista_autorizados: boolean = false;
  lista_solicitados: boolean = false;

  // Habilitar o Deshabilitar el icono de autorización individual
  auto_individual: boolean = true;

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Items de paginación de la tabla autorizados
  tamanio_pagina_autorizado: number = 5;
  numero_pagina_autorizado: number = 1;
  pageSizeOptions_autorizado = [5, 10, 20, 50];

  constructor(
    public restC: PlanComidasService,
    public restEmpleado: EmpleadoService,
    public restPermiso: PermisosService,
    private vistaFlotante: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.ObtenerSolicitudesAutorizados();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  obtenerSolicitudes() {
    this.restC.ObtenerSolComidaNegado().subscribe(res => {
      this.solicitudes = res;
      if (this.solicitudes.length != 0) {
        this.lista_solicitados = true;
      }
    });
  }

/*  permisosTotales: any;
  EditarPermiso(id, id_empl) {
    /* Método para imprimir datos del permiso 
    this.permisosTotales = [];
    this.restPermiso.ObtenerUnPermisoEditar(id).subscribe(datos => {
      this.permisosTotales = datos;
      this.vistaFlotante.open(EditarPermisoEmpleadoComponent, {
        width: '1200px',
        data: { dataPermiso: this.permisosTotales[0], id_empleado: parseInt(id_empl) }
      }).afterClosed().subscribe(items => {
        this.obtenerSolicitudes();
        this.ObtenerSolicitudesAutorizados();
      });
    })

  }*/

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.solicitudes.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.solicitudes.forEach(row => this.selectionUno.select(row));
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
        id_emple_solicita: obj.id_emple_solicita,
        id_cargo: obj.id_empl_cargo,
        estado: obj.estado,
      }
    })
    this.AbrirAutorizaciones(EmpleadosSeleccionados, 'multiple');
  }

  // Autorización de permisos
  AbrirAutorizaciones(datos_permiso, forma: string) {
    this.vistaFlotante.open(AutorizacionesComponent,
      { width: '600px', data: { datosPermiso: datos_permiso, carga: forma } }).afterClosed().subscribe(items => {
        window.location.reload();
        this.obtenerSolicitudes();
        this.ObtenerSolicitudesAutorizados();
      });
  }

  // Lista de permisos que han sido autorizados o negados

  ManejarPaginaAutorizados(e: PageEvent) {
    this.tamanio_pagina_autorizado = e.pageSize;
    this.numero_pagina_autorizado = e.pageIndex + 1;
  }

  solicitudesAutorizados: any = [];
  ObtenerSolicitudesAutorizados() {
    this.restC.ObtenerSolComidaAprobado().subscribe(res => {
      this.solicitudesAutorizados = res;
      for (var i = 0; i <= this.solicitudesAutorizados.length - 1; i++) {
        if (this.solicitudesAutorizados[i].aprobada === true) {
          this.solicitudesAutorizados[i].aprobada = 'AUTORIZADO';
        }
        else if (this.solicitudesAutorizados[i].aprobada === false) {
          this.solicitudesAutorizados[i].aprobada = 'NEGADO';
        }
      }
      if (this.solicitudesAutorizados.length != 0) {
        this.lista_autorizados = true;
      }
    });
  }

}
