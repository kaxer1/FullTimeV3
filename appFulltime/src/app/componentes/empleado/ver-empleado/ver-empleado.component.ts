import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';

import { RegistroContratoComponent } from 'src/app/componentes/empleadoContrato/registro-contrato/registro-contrato.component'
import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { EmplCargosComponent } from 'src/app/componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { RegistrarPeriodoVComponent } from 'src/app/componentes/periodoVacaciones/registrar-periodo-v/registrar-periodo-v.component';
import { RegistrarEmpleProcesoComponent } from 'src/app/componentes/empleadoProcesos/registrar-emple-proceso/registrar-emple-proceso.component';
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from 'src/app/componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroDetallePlanHorarioComponent } from 'src/app/componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';

@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})
export class VerEmpleadoComponent implements OnInit {

  empleadoUno: any = [];
  idEmpleado: string;
  editar: string = '';
  fecha: any = [];
  mostrarDiscapacidad = true;
  mostrarTitulo = true;
  btnDisc = 'Añadir';
  btnTitulo = 'Añadir';
  discapacidadUser: any = [];
  tituloUser: any = [];

  btnHabilitado = true;
  barraDis = false;

  relacionTituloEmpleado: any = [];
  auxRestTitulo: any = [];

  idContrato: any = [];
  idCargo: any = [];
  idPerVacacion: any = [];
  idPlanHorario: any = [];

  constructor(
    public restTitulo: TituloService,
    public restEmpleado: EmpleadoService,
    public restDiscapacidad: DiscapacidadService,
    public restCargo: EmplCargosService,
    public restPerV: PeriodoVacacionesService,
    public restPlanH: PlanHorarioService,
    public vistaRegistrarContrato: MatDialog,
    public vistaRegistrarPlanificacion: MatDialog,
    public vistaRegistrarCargoEmpeado: MatDialog,
    public vistaRegistrarPerVacaciones: MatDialog,
    public vistaRegistrarEmpleProcesos: MatDialog,
    public vistaRegistrarVacaciones: MatDialog,
    public vistaRegistroPlanHorario: MatDialog,
    public vistaRegistroDetallePlanHorario: MatDialog,
    public router: Router,
    private toastr: ToastrService,
  ) {
    var cadena = this.router.url;
    this.idEmpleado = cadena.split("/")[2];
    this.obtenerTituloEmpleado(this.idEmpleado);
    this.obtenerDiscapacidadEmpleado(this.idEmpleado);
  }

  ngOnInit(): void {
    this.verEmpleado(this.idEmpleado);
  }

  onUploadFinish(event) {
    console.log(event);
  }

  // metodo para ver la informacion del empleado 
  verEmpleado(idemploy: any) {
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      // sacar la fecha del JSON 
      var cadena1 = data[0]['fec_nacimiento'];
      var aux1 = cadena1.split("T");
      this.fecha = aux1[0];
    })
  }

  // metodo para obtener a los empleados que tengan alguna discapacidad asignada
  obtenerDiscapacidadEmpleado(idEmployDisca: any) {
    this.restDiscapacidad.getDiscapacidadUsuarioRest(idEmployDisca).subscribe(data => {
      this.discapacidadUser = data;
      this.habilitarBtn();
    }, error => { });
  }

  // metodo para obtener los titulos de un empleado a traves de la tabla EMPL_TITULOS que conecta a la tabla EMPLEADOS con CG_TITULOS 
  obtenerTituloEmpleado(idEmployTitu: any) {
    this.relacionTituloEmpleado = [];

    this.restEmpleado.getEmpleadoTituloRest(idEmployTitu).subscribe(data => {

      this.tituloUser = data;
      let aux = {};
      for (let i of this.tituloUser) {

        this.restTitulo.getOneTituloRest(i.id_titulo).subscribe(res => {
          this.auxRestTitulo = res;
          for (let j of this.auxRestTitulo) {
            aux = {
              observaciones: i.observacion,
              nombre: j.nombre,
              nivel: j.nivel
            }
            this.relacionTituloEmpleado.push(aux);
          }
        });
      }

    }, error => { });
  }

  // El metodo controla que solo se habilite el boton si no existe un registro de discapacidad, 
  // caso contrario se deshabilita para que no permita mas registros de discapacidad al mismo usuario.
  habilitarBtn() {
    if (this.discapacidadUser.length == 0) {
      this.btnHabilitado = true;
    } else {
      this.btnHabilitado = true;
      this.btnDisc = 'Editar';
      this.mostrarDiscapacidad = true;
    }
  }

  // logica de boton para mostrar componente del registro de discapacidad
  mostrarDis() {
    if (this.btnDisc != 'Editar') {
      if (this.mostrarDiscapacidad == true) {
        this.mostrarDiscapacidad = false;
        this.btnDisc = 'No Añadir';
      } else {
        this.mostrarDiscapacidad = true;
        this.btnDisc = 'Añadir';
      }
    } else {
      this.mostrarDiscapacidad = false;
      this.editar = 'editar';
    }
  }

  // logica de boton para mostrar componente del registro y asignacion de titulo al usuario.
  mostrarTit() {
    if (this.mostrarTitulo == true) {
      this.mostrarTitulo = false;
      this.btnTitulo = 'No Añadir'
    } else {
      this.mostrarTitulo = true;
      this.btnTitulo = 'Añadir'
    }
  }

  // Ventana para ingresar contrato del empleado
  AbrirVentanaCrearContrato(): void {
    this.vistaRegistrarContrato.open(RegistroContratoComponent, { width: '900px', data: this.idEmpleado }).disableClose = true;
  }

  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarPlanificacion.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado }).disableClose = true;
  }

  AbrirVentanaCargo(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato[0].id)
      this.vistaRegistrarCargoEmpeado.open(EmplCargosComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaPerVacaciones(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato[0].id)
      this.vistaRegistrarPerVacaciones.open(RegistrarPeriodoVComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaProcesos(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistrarEmpleProcesos.open(RegistrarEmpleProcesoComponent, { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaVacaciones(): void {
    this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPerVacacion = datos;
      console.log("idPerVaca ", this.idPerVacacion[0].id)
      this.vistaRegistrarVacaciones.open(RegistrarVacacionesComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idPerVacacion: this.idPerVacacion[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
    });
  }

  AbrirVentanaPlanHorario(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistroPlanHorario.open(RegistroPlanHorarioComponent, { width: '300px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaDetallePlanHorario(): void {
    this.restPlanH.BuscarIDPlanHorario(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPlanHorario = datos;
      console.log("idcargo ", this.idPlanHorario[0].id)
      this.vistaRegistroDetallePlanHorario.open(RegistroDetallePlanHorarioComponent, { width: '300px', data: { idEmpleado: this.idEmpleado, idPlanHorario: this.idPlanHorario[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Planificación de Horario', 'Primero Registrar Planificación de Horario')
    });
  }

}
