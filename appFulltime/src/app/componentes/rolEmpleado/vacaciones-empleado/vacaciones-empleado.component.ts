import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { EmpleadoProcesosService } from 'src/app/servicios/empleado/empleadoProcesos/empleado-procesos.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { ScriptService } from 'src/app/servicios/empleado/script.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { AutorizaDepartamentoService } from 'src/app/servicios/autorizaDepartamento/autoriza-departamento.service';

import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from 'src/app/componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroEmpleadoPermisoComponent } from 'src/app/componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { CambiarContrasenaComponent } from 'src/app/componentes/rolEmpleado/cambiar-contrasena/cambiar-contrasena.component';
import { MainNavComponent } from 'src/app/share/main-nav/main-nav.component';


@Component({
  selector: 'app-vacaciones-empleado',
  templateUrl: './vacaciones-empleado.component.html',
  styleUrls: ['./vacaciones-empleado.component.css']
})
export class VacacionesEmpleadoComponent implements OnInit {

  iniciales: string;
  urlImagen: any;
  mostrarImagen: boolean = false;
  mostrarIniciales: boolean = false;
  barraDis = false;

  empleadoUno: any = [];
  idEmpleado: string;
  fechaNacimiento: any = [];
  discapacidadUser: any = [];

  relacionTituloEmpleado: any = [];
  auxRestTitulo: any = [];

  idContrato: any = [];
  contratoEmpleadoRegimen: any = [];
  contratoEmpleado: any = [];
  fechaContratoIngreso: string;
  fechaContratoSalida: string;

  fechaCargoInicio: string;
  fechaCargoFinal: string;

  logo: any;
  idCargo: any = [];
  idPerVacacion: any = [];
  idPlanHorario: any = [];
  cont: number;

  /* Items de paginación de la tabla */
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public restTitulo: TituloService,
    public restEmpleado: EmpleadoService,
    public restDiscapacidad: DiscapacidadService,
    public restCargo: EmplCargosService,
    public restPerV: PeriodoVacacionesService,
    public restPlanH: PlanHorarioService,
    public vistaRegistrarDatos: MatDialog,
    public restVacaciones: VacacionesService,
    public restPlanHoraDetalle: DetallePlanHorarioService,
    public restEmpleadoProcesos: EmpleadoProcesosService,
    public restPlanComidas: PlanComidasService,
    public restEmpleHorario: EmpleadoHorariosService,
    public restPermiso: PermisosService,
    public restAutoridad: AutorizaDepartamentoService,
    private toastr: ToastrService,
    private scriptService: ScriptService,
    public Main: MainNavComponent,
  ) {
    this.idEmpleado = localStorage.getItem('empleado');
    this.obtenerTituloEmpleado(parseInt(this.idEmpleado));
    this.obtenerDiscapacidadEmpleado(this.idEmpleado);
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit(): void {
    this.verEmpleado(this.idEmpleado);
    this.obtenerContratoEmpleadoRegimen();
    this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
    this.obtenerPermisos(parseInt(this.idEmpleado))
    this.ObtenerAutorizaciones(parseInt(this.idEmpleado));
    this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
    this.obtenerCargoEmpleado(parseInt(this.idEmpleado));
    this.obtenerEmpleadoProcesos(parseInt(this.idEmpleado));
    this.obtenerPeriodoVacaciones(parseInt(this.idEmpleado));
    this.obtenerVacaciones(parseInt(this.idEmpleado));
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
  /** Método para ver la información del empleado */
  textoBoton: string = 'Subir Foto';
  verEmpleado(idemploy: any) {
    this.empleadoUno = [];
    let idEmpleadoActivo = localStorage.getItem('empleado');
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      this.fechaNacimiento = data[0]['fec_nacimiento'].split("T")[0];
      if (data[0]['imagen'] != null) {
        this.urlImagen = 'http://localhost:3000/empleado/img/' + data[0]['imagen'];
        this.mostrarImagen = true;
        this.mostrarIniciales = false;
        this.textoBoton = 'Editar Foto';
        if (idEmpleadoActivo === idemploy){
          this.Main.urlImagen = this.urlImagen;
        }
      } else {
        this.iniciales = data[0].nombre.split(" ")[0].slice(0, 1) + data[0].apellido.split(" ")[0].slice(0, 1);
        this.mostrarIniciales = true
        this.mostrarImagen = false;
        this.textoBoton = 'Subir Foto';
      }
    })
  }

  /** Método para obtener datos de discapacidad */
  obtenerDiscapacidadEmpleado(idEmployDisca: any) {
    this.discapacidadUser = [];
    this.restDiscapacidad.getDiscapacidadUsuarioRest(idEmployDisca).subscribe(data => {
      this.discapacidadUser = data;
    }, error => { console.log("") });
  }

  /** Método para obtener los títulos de un empleado a través de la tabla EMPL_TITULOS 
    * que conecta a la tabla EMPLEADOS con CG_TITULOS */
  obtenerTituloEmpleado(idEmployTitu: number) {
    this.relacionTituloEmpleado = [];
    this.restEmpleado.getEmpleadoTituloRest(idEmployTitu).subscribe(data => {
      this.relacionTituloEmpleado = data;
    }, error => { console.log("") });
  }

  /** Método para obtener el contrato de un empleado con su respectivo régimen laboral */
  idContratoEmpleado: number;
  obtenerContratoEmpleadoRegimen() {
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleadoRegimen = res;
    }, error => { console.log("") });
    this.restEmpleado.BuscarContratoIdEmpleado(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleado = res;
    }, error => { console.log("") });
  }

  /** Método para obtener los datos del cargo del empleado */
  cargoEmpleado: any = [];
  cargosTotalesEmpleado: any = [];
  obtenerCargoEmpleado(id_empleado: number) {
    this.cargoEmpleado = [];
    this.cargosTotalesEmpleado = [];
    this.restEmpleado.BuscarIDContrato(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      for (let i = 0; i <= this.idContrato.length - 1; i++) {
        console.log("idContratoProbandoJenny", this.idContrato[i].id);
        this.restCargo.getInfoCargoEmpleadoRest(this.idContrato[i]['id']).subscribe(datos => {
          this.cargoEmpleado = datos;
          console.log("jenny datos", this.cargoEmpleado)
          if (this.cargoEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.cargosTotalesEmpleado = datos
              this.cont++;
            }
            else {
              this.cargosTotalesEmpleado = this.cargosTotalesEmpleado.concat(datos);
              console.log("Datos Cargos " + i + '', this.cargosTotalesEmpleado)
            }
          }
        });
      }
    });
  }

  /* Método para imprimir datos del permiso */
  permisosEmpleado: any;
  permisosTotales: any;
  obtenerPermisos(id_empleado: number) {
    this.permisosEmpleado = [];
    this.permisosTotales = [];
    this.restEmpleado.BuscarIDContrato(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      // console.log("idContrato ", this.idContrato[0].id);
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

  planHorario: any;
  obtenerPlanHorarios(idEmpleadoCargo: number) {
    this.restPlanH.ObtenerPlanHorarioPorIdCargo(idEmpleadoCargo).subscribe(res => {
      this.planHorario = res;
      this.planHorario.map(obj => {
        this.obtenerPlanHoraDetalle(obj.id);
      })
    }, error => { console.log("") });
  }

  planHoraDetalle: any;
  obtenerPlanHoraDetalle(id_plan_horario: number) {
    this.restPlanHoraDetalle.ObtenerPlanHoraDetallePorIdPlanHorario(id_plan_horario).subscribe(res => {
      this.planHoraDetalle = res;
    }, error => { console.log("") });
  }

  /** Método para mostrar datos de los procesos del empleado */
  buscarProcesos: any = [];
  empleadoProcesos: any = [];
  obtenerEmpleadoProcesos(id_empleado: number) {
    this.buscarProcesos = [];
    this.empleadoProcesos = [];
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      console.log("idCargo Procesos", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restEmpleadoProcesos.ObtenerProcesoPorIdCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.buscarProcesos = datos;
          if (this.buscarProcesos.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.empleadoProcesos = datos
              this.cont++;
            }
            else {
              this.empleadoProcesos = this.empleadoProcesos.concat(datos);
              console.log("Datos procesos" + i + '', this.empleadoProcesos)
            }
          }
        })
      }
    });
  }

  /** Método para mostrar datos de planificación de almuerzos */
  planComidas: any;
  obtenerPlanComidasEmpleado(id_empleado: number) {
    this.planComidas = [];
    this.restPlanComidas.obtenerPlanComidaPorIdEmpleado(id_empleado).subscribe(res => {
      this.planComidas = res
    }, error => { console.log("") });
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

  /* Método para mostrar datos de autoridad departamentos */
  autorizacionEmpleado: any;
  autorizacionesTotales: any;
  ObtenerAutorizaciones(id_empleado: number) {
    this.autorizacionEmpleado = [];
    this.autorizacionesTotales = [];
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      console.log("idCargo ", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restAutoridad.BuscarAutoridadCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.autorizacionEmpleado = datos;
          if (this.autorizacionEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.autorizacionesTotales = datos
              this.cont++;
            }
            else {
              this.autorizacionesTotales = this.autorizacionesTotales.concat(datos);
              console.log("Datos autorizacion" + i + '', this.autorizacionesTotales)
            }
          }
        })
      }
    });
  }

  /* Método para mostrar datos de horario */
  horariosEmpleado: any;
  horariosEmpleadoTotales: any = [];
  ObtenerHorariosEmpleado(id_empleado: number) {
    this.horariosEmpleado = [];
    this.horariosEmpleadoTotales = [];
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      console.log("idCargo ", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restEmpleHorario.BuscarHorarioCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.horariosEmpleado = datos;
          if (this.horariosEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.horariosEmpleadoTotales = datos
              this.cont++;
            }
            else {
              this.horariosEmpleadoTotales = this.horariosEmpleadoTotales.concat(datos);
              console.log("Datos autorizacion" + i + '', this.horariosEmpleadoTotales)
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

  /* Ventana para ingresar planificación de comidas */
  CambiarContrasena(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(CambiarContrasenaComponent, { width: '350px', data: this.idEmpleado }).disableClose = true;
  }

  /* Ventana para ingresar planificación de comidas */
  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado }).afterClosed().subscribe(item => {
      this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
    });
  }

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

  /* Ventana para registrar planificación de horarios del empleado */
  AbrirVentanaPlanHorario(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistroPlanHorarioComponent,
        { width: '300px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
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

}
