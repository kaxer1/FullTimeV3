import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';



@Component({
  selector: 'app-vacaciones-empleado',
  templateUrl: './vacaciones-empleado.component.html',
  styleUrls: ['./vacaciones-empleado.component.css']
})
export class VacacionesEmpleadoComponent implements OnInit {

  idEmpleado: string;
  idContrato: any = [];
  idPerVacacion: any = [];
  cont: number;

  constructor(
    public restEmpleado: EmpleadoService,
    public restPerV: PeriodoVacacionesService,
    public vistaRegistrarDatos: MatDialog,
    public restVacaciones: VacacionesService,
    private toastr: ToastrService,
  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.obtenerPeriodoVacaciones(parseInt(this.idEmpleado));
    this.obtenerVacaciones(parseInt(this.idEmpleado));
  }

/* 
   * ***************************************************************************************************
   *                               MÉTODO PARA MOSTRAR DATOS
   * ***************************************************************************************************
  */

  vacaciones: any = [];
  obtenerVacaciones(id_empleado: number) {
    this.restPerV.BuscarIDPerVacaciones(id_empleado).subscribe(datos => {
      this.idPerVacacion = datos;
      console.log("idPerVaca ", this.idPerVacacion[0].id);
      this.restVacaciones.ObtenerVacacionesPorIdPeriodo(this.idPerVacacion[0].id).subscribe(res => {
        this.vacaciones = res;
      }, error => { console.log("") });
    }, error => { });
  }

  /* Método para imprimir datos del periodo de vacaciones */
  buscarPeriodosVacaciones: any;
  peridoVacaciones: any;
  obtenerPeriodoVacaciones(id_empleado: number) {
    this.buscarPeriodosVacaciones = [];
    this.peridoVacaciones = [];
    this.restEmpleado.BuscarIDContrato(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      console.log("idContrato ", this.idContrato[0].id);
      for (let i = 0; i <= this.idContrato.length - 1; i++) {
        this.restPerV.getInfoPeriodoVacacionesPorIdContrato(this.idContrato[i]['id']).subscribe(datos => {
          this.buscarPeriodosVacaciones = datos;
          if (this.buscarPeriodosVacaciones.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.peridoVacaciones = datos
              this.cont++;
            }
            else {
              this.peridoVacaciones = this.peridoVacaciones.concat(datos);
              console.log("Datos Periodo Vacaciones" + i + '', this.peridoVacaciones)
            }
          }
        })
      }
    });
  }

  /* 
  ****************************************************************************************************
  *                               ABRIR VENTANAS DE SOLICITUDES
  ****************************************************************************************************
  */

  /* Ventana para registrar vacaciones del empleado */
  AbrirVentanaVacaciones(): void {
    this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPerVacacion = datos;
      console.log(this.idPerVacacion)
      this.vistaRegistrarDatos.open(RegistrarVacacionesComponent,
        { width: '900px', data: { idEmpleado: this.idEmpleado, idPerVacacion: this.idPerVacacion[0].id, idContrato: this.idPerVacacion[0].idcontrato } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
    });
  }

}
