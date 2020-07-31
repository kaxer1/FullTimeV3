import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

import { RegistroEmpleadoPermisoComponent } from 'src/app/componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { CancelarPermisoComponent } from './cancelar-permiso/cancelar-permiso.component';

@Component({
  selector: 'app-solicitar-permisos-empleado',
  templateUrl: './solicitar-permisos-empleado.component.html',
  styleUrls: ['./solicitar-permisos-empleado.component.css']
})
export class SolicitarPermisosEmpleadoComponent implements OnInit {

  idEmpleado: string;
  idContrato: any = [];
  idPerVacacion: any = [];
  cont: number;

  constructor(
    public restEmpleado: EmpleadoService,
    public restPerV: PeriodoVacacionesService,
    public vistaRegistrarDatos: MatDialog,
    public restPermiso: PermisosService,
    private toastr: ToastrService,

  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.obtenerPermisos(parseInt(this.idEmpleado))
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
          if (this.permisosEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.permisosTotales = datos
              this.cont++;
            }
            else {
              this.permisosTotales = this.permisosTotales.concat(datos);
              console.log("Datos Permisos" + i + '', this.permisosTotales)
            }
          }
        })
      }
    });
  }

  /* Ventana para registrar permisos del empleado */
  AbrirVentanaPermiso(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("Ultimo idContrato ", this.idContrato[this.idContrato.length - 1].id)
      this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idPerVacacion = datos;
        console.log("idPerVaca ", this.idPerVacacion[0].id)
        this.vistaRegistrarDatos.open(RegistroEmpleadoPermisoComponent,
          {
            width: '1200px',
            data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[this.idContrato.length - 1].id, idPerVacacion: this.idPerVacacion[0].id }
          }).afterClosed().subscribe(item => {
            this.obtenerPermisos(parseInt(this.idEmpleado));
          });
      }, error => {
        this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }


  CancelarPermiso(dataPermiso) {
    this.vistaRegistrarDatos.open(CancelarPermisoComponent, {width: '300px', data: dataPermiso}).afterClosed().subscribe(items => {
      this.obtenerPermisos(parseInt(this.idEmpleado))
    });
  }
}
