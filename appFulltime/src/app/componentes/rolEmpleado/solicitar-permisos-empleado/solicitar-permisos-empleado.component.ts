import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

import { RegistroEmpleadoPermisoComponent } from 'src/app/componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { CancelarPermisoComponent } from './cancelar-permiso/cancelar-permiso.component';
import { EditarPermisoEmpleadoComponent } from './editar-permiso-empleado/editar-permiso-empleado.component';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';

@Component({
  selector: 'app-solicitar-permisos-empleado',
  templateUrl: './solicitar-permisos-empleado.component.html',
  styleUrls: ['./solicitar-permisos-empleado.component.css']
})
export class SolicitarPermisosEmpleadoComponent implements OnInit {

  idEmpleado: string;
  idContrato: any = [];
  idPerVacacion: any = [];
  idCargo: any = [];
  cont: number;

  /* Items de paginación de la tabla */
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public restEmpleado: EmpleadoService,
    public restPerV: PeriodoVacacionesService,
    public vistaRegistrarDatos: MatDialog,
    public restPermiso: PermisosService,
    public restCargo: EmplCargosService,
    private toastr: ToastrService,

  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.obtenerPermisos(parseInt(this.idEmpleado));
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  /* 
   * ***************************************************************************************************
   *                               MÉTODO PARA MOSTRAR DATOS
   * ***************************************************************************************************
  */

  /* Método para imprimir datos del permiso */
  permisosEmpleado: any;
  permisosTotales: any;
  obtenerPermisos(id_empleado: number) {
    this.permisosEmpleado = [];
    this.permisosTotales = [];
    this.restEmpleado.BuscarIDContrato(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      console.log("idContrato ", this.idContrato);
      for (let i = 0; i <= this.idContrato.length - 1; i++) {
        this.restPermiso.BuscarPermisoContrato(this.idContrato[i]['id']).subscribe(datos => {
          this.permisosEmpleado = datos;
          console.log(this.permisosTotales);
          if (this.permisosEmpleado.length != 0) {
            if (this.cont === 0) {
              this.permisosTotales = datos;
              this.OrdenarDatos(this.permisosTotales);
              this.cont++;
            }
            else {
              this.permisosTotales = this.permisosTotales.concat(datos);
              this.OrdenarDatos(this.permisosTotales);
            }
          }
        })
      }
    });
  }

  // Ordenar los datos según el número de permiso
  OrdenarDatos(array) {
    function compare(a, b) {
      if (a.num_permiso < b.num_permiso) {
        return -1;
      }
      if (a.num_permiso > b.num_permiso) {
        return 1;
      }
      return 0;
    }
    array.sort(compare);
  }

  /* Ventana para registrar permisos del empleado */
  AbrirVentanaPermiso(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;

      this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idCargo = datos;

        this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
          this.idPerVacacion = datos;

          this.vistaRegistrarDatos.open(RegistroEmpleadoPermisoComponent,
            {
              width: '1200px',
              data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[this.idContrato.length - 1].id, idPerVacacion: this.idPerVacacion[0].id, idCargo: this.idCargo[0].max }
            }).afterClosed().subscribe(item => {
              this.obtenerPermisos(parseInt(this.idEmpleado));
            });
        }, error => {
          this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
        });
      }, error => {
        this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  CancelarPermiso(dataPermiso) {
    this.vistaRegistrarDatos.open(CancelarPermisoComponent, { width: '300px', data: dataPermiso }).afterClosed().subscribe(items => {
      if (items === true) {
        this.obtenerPermisos(parseInt(this.idEmpleado));
      }
    });
  }

  EditarPermiso(dataPermiso) {
    this.vistaRegistrarDatos.open(EditarPermisoEmpleadoComponent, { width: '1200px', data: dataPermiso }).afterClosed().subscribe(items => {
      if (items === true) {
        this.obtenerPermisos(parseInt(this.idEmpleado));
      }
    });
  }
}
