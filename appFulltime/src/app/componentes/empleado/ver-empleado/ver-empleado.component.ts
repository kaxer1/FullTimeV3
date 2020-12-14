import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';

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
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

import { RegistroContratoComponent } from 'src/app/componentes/empleadoContrato/registro-contrato/registro-contrato.component'
import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { EmplCargosComponent } from 'src/app/componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { RegistrarPeriodoVComponent } from 'src/app/componentes/periodoVacaciones/registrar-periodo-v/registrar-periodo-v.component';
import { RegistrarEmpleProcesoComponent } from 'src/app/componentes/empleadoProcesos/registrar-emple-proceso/registrar-emple-proceso.component';
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from 'src/app/componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroDetallePlanHorarioComponent } from 'src/app/componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';
import { RegistroAutorizacionDepaComponent } from 'src/app/componentes/autorizacionDepartamento/registro-autorizacion-depa/registro-autorizacion-depa.component';
import { RegistroEmpleadoPermisoComponent } from 'src/app/componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { RegistoEmpleadoHorarioComponent } from 'src/app/componentes/empleadoHorario/registo-empleado-horario/registo-empleado-horario.component';
import { EditarEmpleadoProcesoComponent } from 'src/app/componentes/empleadoProcesos/editar-empleado-proceso/editar-empleado-proceso.component';
import { EditarPeriodoVacacionesComponent } from 'src/app/componentes/periodoVacaciones/editar-periodo-vacaciones/editar-periodo-vacaciones.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';
import { MainNavComponent } from 'src/app/share/main-nav/main-nav.component';
import { EditarHorarioEmpleadoComponent } from 'src/app/componentes/empleadoHorario/editar-horario-empleado/editar-horario-empleado.component';
import { EditarPlanificacionComponent } from 'src/app/componentes/planHorarios/editar-planificacion/editar-planificacion.component';
import { EditarPlanComidasComponent } from 'src/app/componentes/planificacionComidas/editar-plan-comidas/editar-plan-comidas.component';
import { EditarAutorizacionDepaComponent } from 'src/app/componentes/autorizacionDepartamento/editar-autorizacion-depa/editar-autorizacion-depa.component';
import { PedidoHoraExtraComponent } from '../../horasExtras/pedido-hora-extra/pedido-hora-extra.component';
import { EditarPermisoEmpleadoComponent } from 'src/app/componentes/rolEmpleado/solicitar-permisos-empleado/editar-permiso-empleado/editar-permiso-empleado.component';
import { CancelarPermisoComponent } from 'src/app/componentes/rolEmpleado/solicitar-permisos-empleado/cancelar-permiso/cancelar-permiso.component';
import { CancelarHoraExtraComponent } from 'src/app/componentes/rolEmpleado/hora-extra-empleado/cancelar-hora-extra/cancelar-hora-extra.component';
import { EditarHoraExtraEmpleadoComponent } from 'src/app/componentes/rolEmpleado/hora-extra-empleado/editar-hora-extra-empleado/editar-hora-extra-empleado.component';
import { CancelarVacacionesComponent } from 'src/app/componentes/rolEmpleado/vacaciones-empleado/cancelar-vacaciones/cancelar-vacaciones.component';
import { EditarVacacionesEmpleadoComponent } from 'src/app/componentes/rolEmpleado/vacaciones-empleado/editar-vacaciones-empleado/editar-vacaciones-empleado.component';
import { CambiarContrasenaComponent } from '../../rolEmpleado/cambiar-contrasena/cambiar-contrasena.component';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { PlanGeneralService } from 'src/app/servicios/planGeneral/plan-general.service';

@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})

export class VerEmpleadoComponent implements OnInit {

  empleadoUno: any = [];
  idEmpleado: string;
  editar: string = '';
  fechaNacimiento: any = [];
  mostrarDiscapacidad = true;
  mostrarTitulo = true;
  btnDisc = 'Añadir';
  btnTitulo = 'Añadir';
  discapacidadUser: any = [];

  btnHabilitado = true;
  barraDis = false;

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

  ruta: string;
  rutaTitulo: string;
  rutaContrato: string;
  rutaCargo: string;

  /* Items de paginación de la tabla */
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];
  selectedIndex: number;

  /** Contador */
  cont = 0;
  actualizar: boolean;

  // Datos empleado logueado
  empleadoLogueado: any = [];
  idEmpleadoLogueado: number;

  HabilitarAccion: boolean;
  HabilitarHorasE: boolean;

  constructor(
    public restU: UsuarioService,
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
    public restEmpresa: EmpresaService,
    private restHE: PedHoraExtraService,
    private restDetallesP: DetallePlanHorarioService,
    private restPlanGeneral: PlanGeneralService,
    public Main: MainNavComponent,
    public router: Router,
    private toastr: ToastrService,
    private scriptService: ScriptService
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
    var cadena = this.router.url.split('#')[0];
    this.ruta = 'http://localhost:4200' + cadena + '#editar';
    this.rutaTitulo = 'http://localhost:4200' + cadena + '#editarTitulo';
    this.rutaContrato = 'http://localhost:4200' + cadena + '#editarContrato';
    this.rutaCargo = 'http://localhost:4200' + cadena + '#editarCargo';
    this.idEmpleado = cadena.split("/")[2];
    this.obtenerTituloEmpleado(parseInt(this.idEmpleado));
    this.obtenerDiscapacidadEmpleado(this.idEmpleado);
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit(): void {
    this.ObtenerEmpleadoLogueado(this.idEmpleadoLogueado);
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
    this.obtenerPlanHorarios(parseInt(this.idEmpleado));
    this.ObtenerlistaHorasExtrasEmpleado();
    this.obtenerContratosEmpleado();
    this.VerAccionPersonal();
    this.VerHorasExtras();
    this.ObtenerLogo();
    this.ObtnerColores();
    this.VerAccionContrasena(this.idEmpleado);
  }

  // Método para ver la información del empleado 
  ObtenerEmpleadoLogueado(idemploy: any) {
    this.empleadoLogueado = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoLogueado = data;
    })
  }

  // Método para obtener el logo de la empresa
  logoE: any = String;
  ObtenerLogo() {
    this.restEmpresa.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logoE = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  // Método para obtener colores de empresa
  p_color: any;
  s_color: any;
  ObtnerColores() {
    this.restEmpresa.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  btnActualizar: boolean = true;
  verRegistroEdicion(value: boolean) {
    this.btnActualizar = value;
  }

  btnActualizarTitulo: boolean = true;
  verTituloEdicion(value: boolean) {
    this.btnActualizarTitulo = value;
  }

  btnActualizarContrato: boolean = true;
  verContratoEdicion(value: boolean) {
    this.btnActualizarContrato = value;
  }

  btnActualizarCargo: boolean = true;
  verCargoEdicion(value: boolean) {
    this.btnActualizarCargo = value;
  }

  idSelect: number;
  ObtenerIdTituloSeleccionado(idTituloEmpleado: number) {
    this.idSelect = idTituloEmpleado;
  }

  idSelectContrato: number;
  ObtenerIdContratoSeleccionado(idContratoEmpleado: number) {
    this.idSelectContrato = idContratoEmpleado;
  }

  idSelectCargo: number;
  ObtenerIdCargoSeleccionado(idCargoEmpleado: number) {
    this.idSelectCargo = idCargoEmpleado;
  }

  /* 
   * ***************************************************************************************************
   *                               MÉTODO PARA MOSTRAR DATOS
   * ***************************************************************************************************
  */
  /** Método para ver la información del empleado */
  urlImagen: any;
  iniciales: any;
  mostrarImagen: boolean = false;
  mostrarIniciales: boolean = false;
  textoBoton: string = 'Subir Foto';
  verEmpleado(idemploy: any) {
    this.empleadoUno = [];
    let idEmpleadoActivo = localStorage.getItem('empleado');
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      this.fechaNacimiento = data[0]['fec_nacimiento'].split("T")[0];
      if (data[0]['imagen'] != null) {
        this.urlImagen = 'http://localhost:3000/empleado/img/' + data[0]['imagen'];
        if (idEmpleadoActivo === idemploy) {
          this.Main.urlImagen = this.urlImagen;
        }
        this.mostrarImagen = true;
        this.mostrarIniciales = false;
        this.textoBoton = 'Editar Foto';
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
      this.habilitarBtn();
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
    this.restEmpleado.BuscarIDContratoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      this.restEmpleado.BuscarDatosContrato(this.idContrato[0].max).subscribe(res => {
        this.contratoEmpleado = res;
      }, error => { });
    }, error => { });
  }

  /** Método para ver lista de todos los contratos*/
  contratoBuscado: any = [];
  obtenerContratosEmpleado() {
    this.contratoBuscado = [];
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoBuscado = res;
    }, error => { });
  }

  /** Método para ver datos del contrato seleccionado */
  fechaContrato = new FormControl('');
  public contratoForm = new FormGroup({
    fechaContratoForm: this.fechaContrato,
  });
  contratoSeleccionado: any = [];
  listaCargos: any = [];
  obtenerContratoSeleccionado(form) {
    this.LimpiarCargo();
    this.contratoSeleccionado = [];
    this.restEmpleado.BuscarDatosContrato(form.fechaContratoForm).subscribe(res => {
      this.contratoSeleccionado = res;
    }, error => { });
    this.restCargo.getInfoCargoEmpleadoRest(form.fechaContratoForm).subscribe(datos => {
      this.listaCargos = datos;
    }, error => {
      this.toastr.info('El contrato seleccionado no registra ningún cargo', 'VERIFICAR', {
        timeOut: 6000,
      });
    });
  }

  /** Método para limpiar registro */
  LimpiarContrato() {
    this.contratoForm.reset();
    this.cargoForm.reset();
    this.contratoSeleccionado = [];
    this.listaCargos = [];
    this.cargoSeleccionado = [];
  }

  /** Método para obtener los datos del cargo del empleado */
  cargoEmpleado: any = [];
  cargosTotalesEmpleado: any = [];
  obtenerCargoEmpleado(id_empleado: number) {
    this.cargoEmpleado = [];
    this.cargosTotalesEmpleado = [];
    this.restCargo.BuscarIDCargoActual(id_empleado).subscribe(datos => {
      this.cargosTotalesEmpleado = datos;
      let cargoIdActual = this.cargosTotalesEmpleado[0].max;
      this.restCargo.getUnCargoRest(cargoIdActual).subscribe(datos => {
        this.cargoEmpleado = datos;
      }, error => { });
    });
  }

  /** Método para limpiar registro */
  LimpiarCargo() {
    this.cargoForm.reset();
    this.listaCargos = [];
    this.cargoSeleccionado = [];
  }

  /** Método para ver cargo seleccionado */
  fechaICargo = new FormControl('');
  public cargoForm = new FormGroup({
    fechaICargoForm: this.fechaICargo,
  });
  cargoSeleccionado: any = [];
  obtenerCargoSeleccionadoEmpleado(form) {
    this.cargoSeleccionado = [];
    this.restCargo.getUnCargoRest(form.fechaICargoForm).subscribe(datos => {
      this.cargoSeleccionado = datos;
    }, error => { });
  }


  /* Método para imprimir datos del permiso */
  permisosTotales: any;
  obtenerPermisos(id_empleado: number) {
    this.permisosTotales = [];
    this.restEmpleado.getOneEmpleadoRest(id_empleado).subscribe(datos => {
      this.restPermiso.BuscarPermisoCodigo(datos[0].codigo).subscribe(datos => {
        this.permisosTotales = datos;
      })
    });
  }

  /** Método para imprimir datos de Vacaciones */
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

  /** Método para imprimir datos de la planificación de horarios */
  planHorario: any;
  planHorarioTotales: any;
  obtenerPlanHorarios(id_empleado: number) {
    this.planHorario = [];
    this.planHorarioTotales = [];
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      //console.log("idCargo Procesos", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restPlanH.ObtenerPlanHorarioPorIdCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.planHorario = datos;
          if (this.planHorario.length != 0) {
            if (this.cont === 0) {
              this.planHorarioTotales = datos
              this.cont++;
            }
            else {
              this.planHorarioTotales = this.planHorarioTotales.concat(datos);
              console.log("Datos plan horario" + i + '', this.planHorarioTotales)
            }
          }
        })
      }
    });
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

  hora_extra: any = [];
  ObtenerlistaHorasExtrasEmpleado() {
    this.hora_extra = [];
    this.restHE.ObtenerListaEmpleado(parseInt(this.idEmpleado)).subscribe(res => {
      console.log('estado', res);
      this.hora_extra = res;
      for (var i = 0; i <= this.hora_extra.length - 1; i++) {
        if (this.hora_extra[i].estado === 1) {
          this.hora_extra[i].estado = 'Pendiente';
        }
        else if (this.hora_extra[i].estado === 2) {
          this.hora_extra[i].estado = 'Pre-autorizado';
        }
        else if (this.hora_extra[i].estado === 3) {
          this.hora_extra[i].estado = 'Autorizado';
        }
        else if (this.hora_extra[i].estado === 4) {
          this.hora_extra[i].estado = 'Negado';
        }
      }

    });
  }

  /* 
 ****************************************************************************************************
 *                               ABRIR VENTANAS PARA ELIMINAR DATOS DEL EMPLEADO
 ****************************************************************************************************
*/

  /* Eliminar registro de discapacidad */
  eliminarDiscapacidad(id_discapacidad: number) {
    console.log("id_dicacapacidad", id_discapacidad)
    this.restDiscapacidad.deleteDiscapacidadUsuarioRest(id_discapacidad).subscribe(res => {
      this.obtenerDiscapacidadEmpleado(this.idEmpleado);
      this.btnDisc = 'Añadir';
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
    })
  };

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeleteDiscapacidad(id: number) {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminarDiscapacidad(id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  /* Eliminar registro de título */
  eliminarTituloEmpleado(id: number) {
    this.restEmpleado.deleteEmpleadoTituloRest(id).subscribe(res => {
      this.obtenerTituloEmpleado(parseInt(this.idEmpleado));
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.habilitarBtn();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeleteTitulo(id: number) {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminarTituloEmpleado(id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  /** Función para eliminar registro seleccionado HORARIO*/
  EliminarHorario(id_horario: number) {
    this.restEmpleHorario.EliminarRegistro(id_horario).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeleteHorario(datos: any) {
    console.log('datos horario', datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarPlanGeneral(datos.fec_inicio, datos.fec_final, datos.id_horarios, datos.codigo)
          this.EliminarHorario(datos.id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  /* Buscar fechas de horario*/
  id_planificacion_general: any = [];
  EliminarPlanGeneral(fec_inicio, fec_final, horario, codigo) {
    this.id_planificacion_general = [];
    let plan_fecha = {
      fec_inicio: fec_inicio.split('T')[0],
      fec_final: fec_final.split('T')[0],
      id_horario: horario,
      codigo: parseInt(codigo)
    };
    this.restPlanGeneral.BuscarFechas(plan_fecha).subscribe(res => {
      this.id_planificacion_general = res;
      this.id_planificacion_general.map(obj => {
        this.restPlanGeneral.EliminarRegistro(obj.id).subscribe(res => {
        })
      })
    })
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarPlanificacion(id_plan: number) {
    this.restPlanH.EliminarRegistro(id_plan).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.obtenerPlanHorarios(parseInt(this.idEmpleado));
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeletePlanificacion(datos: any) {
    console.log('planificacion', datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.BuscarDatosPlanHorario(datos.id, datos.codigo)
          this.EliminarPlanificacion(datos.id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  /* Buscar detalles de la planificación */
  detallesPlanificacion: any = [];
  BuscarDatosPlanHorario(id_planificacion: any, codigo) {
    this.detallesPlanificacion = [];
    this.restDetallesP.ObtenerPlanHoraDetallePorIdPlanHorario(id_planificacion).subscribe(datos => {
      this.detallesPlanificacion = datos;
      console.log('detalles', this.detallesPlanificacion);
      this.detallesPlanificacion.map(obj => {
        this.EliminarPlanificacionGeneral(obj.fecha, obj.id_horario, codigo)
      })
    })
  }

  /** Eliminar registros de planificacion general */
  EliminarPlanificacionGeneral(fecha, horario, codigo) {
    this.id_planificacion_general = [];
    let plan_fecha = {
      fec_inicio: fecha.split('T')[0],
      id_horario: horario,
      codigo: parseInt(codigo)
    };
    this.restPlanGeneral.BuscarFecha(plan_fecha).subscribe(res => {
      this.id_planificacion_general = res;
      this.id_planificacion_general.map(obj => {
        this.restPlanGeneral.EliminarRegistro(obj.id).subscribe(res => {
        })
      })
    })
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarPlanComidas(id_plan: number) {
    this.restPlanComidas.EliminarRegistro(id_plan).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeletePlanComidas(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarPlanComidas(datos.id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarProceso(id_plan: number) {
    this.restEmpleadoProcesos.EliminarRegistro(id_plan).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.obtenerEmpleadoProcesos(parseInt(this.idEmpleado));
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeleteProceso(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarProceso(datos.id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarAutorizacion(id_auto: number) {
    this.restAutoridad.EliminarRegistro(id_auto).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.ObtenerAutorizaciones(parseInt(this.idEmpleado));
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeleteAutorizacion(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarAutorizacion(datos.id);
        } else {
          this.router.navigate(['/verEmpleado/', this.idEmpleado]);
        }
      });
  }

  CancelarHoraExtra(h) {
    this.vistaRegistrarDatos.open(CancelarHoraExtraComponent, { width: '300px', data: h.id }).afterClosed().subscribe(items => {
      console.log(items);
      if (items === true) {
        this.ObtenerlistaHorasExtrasEmpleado();
      }
    });
  }

  CancelarPermiso(dataPermiso) {
    this.vistaRegistrarDatos.open(CancelarPermisoComponent, { width: '300px', data: dataPermiso }).afterClosed().subscribe(items => {
      if (items === true) {
        this.obtenerPermisos(parseInt(this.idEmpleado));
      }
    });
  }

  CancelarVacaciones(v) {
    this.vistaRegistrarDatos.open(CancelarVacacionesComponent, { width: '300px', data: v.id }).afterClosed().subscribe(items => {
      this.obtenerVacaciones(parseInt(this.idEmpleado));
    });
  }

  /* 
  ****************************************************************************************************
  *                               ACCIONES BOTONES
  ****************************************************************************************************
 */

  /* Este Método controla que se habilite el botón si no existe un registro de discapacidad, 
   * si hay registro se habilita para actualizar este registro. */
  habilitarBtn() {
    if (this.discapacidadUser.length == 0) {
      this.btnHabilitado = true;
    } else {
      this.btnHabilitado = true;
      this.btnDisc = 'Editar';
      this.mostrarDiscapacidad = true;
    }
  }

  /* Lógica de botón para mostrar componente del registro de discapacidad */
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
      if (this.mostrarDiscapacidad == false) {
        this.mostrarDiscapacidad = true;
        this.editar = 'editar';
      } else {
        this.mostrarDiscapacidad = false;
        this.editar = 'editar';
      }
    }
  }

  /* Lógica de botón para mostrar componente del registro y asignación de título al usuario. */
  mostrarTit() {
    if (this.mostrarTitulo == true) {
      this.mostrarTitulo = false;
      this.btnTitulo = 'Cerrar'
    } else {
      this.mostrarTitulo = true;
      this.btnTitulo = 'Añadir'
    }
  }

  /* 
   ****************************************************************************************************
   *                               ABRIR VENTANAS PARA REGISTRAR DATOS DEL EMPLEADO
   ****************************************************************************************************
  */
  /* Ventana para ingresar contrato del empleado*/
  AbrirVentanaCrearContrato(): void {
    this.vistaRegistrarDatos.open(RegistroContratoComponent, { width: '650px', data: this.idEmpleado }).
      afterClosed().subscribe(item => {
        this.obtenerContratoEmpleadoRegimen();
        this.obtenerCargoEmpleado(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para ingresar cargo del empleado */
  AbrirVentanaCargo(): void {
    this.restEmpleado.BuscarIDContratoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log(datos);
      console.log("idcargo ", this.idContrato[0].max)
      this.vistaRegistrarDatos.open(EmplCargosComponent,
        { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].max } }).
        afterClosed().subscribe(item => {
          this.obtenerCargoEmpleado(parseInt(this.idEmpleado));
        });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato', {
        timeOut: 6000,
      });
    });
  }

  /* Ventana para registrar horario */
  AbrirVentanaEmplHorario(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistoEmpleadoHorarioComponent,
        { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } }).afterClosed().subscribe(item => {
          this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
        });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
        timeOut: 6000,
      })
    });
  }

  /* Ventana para ingresar período de vacaciones */
  AbrirVentanaPerVacaciones(): void {
    this.restEmpleado.BuscarIDContratoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato);
      this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idPerVacacion = datos;
        console.log("idPerVaca ", this.idPerVacacion[0].id);
        this.toastr.info('El empleado ya tiene registrado un periodo de vacaciones y este se actualiza automáticamente', '', {
          timeOut: 6000,
        })
      }, error => {
        this.vistaRegistrarDatos.open(RegistrarPeriodoVComponent,
          { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].max } })
          .afterClosed().subscribe(item => {
            this.obtenerPeriodoVacaciones(parseInt(this.idEmpleado));
          });
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato', {
        timeOut: 6000,
      })
    });
  }

  /* Ventana para registrar vacaciones del empleado */
  AbrirVentanaVacaciones(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idPerVacacion = datos;
        console.log("idPerVaca ", this.idPerVacacion)
        this.vistaRegistrarDatos.open(RegistrarVacacionesComponent,
          { width: '900px', data: { idEmpleado: this.idEmpleado, idPerVacacion: this.idPerVacacion[0].id, idContrato: this.idPerVacacion[0].idcontrato, idCargo: this.idCargo[0].max } })
          .afterClosed().subscribe(item => {
            this.obtenerVacaciones(parseInt(this.idEmpleado));
          });
      }, error => {
        this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones', {
          timeOut: 6000,
        })
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
        timeOut: 6000,
      })
    });
  }

  /* Ventana para registrar planificación de horarios del empleado */
  AbrirVentanaPlanHorario(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistroPlanHorarioComponent,
        { width: '300px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } })
        .afterClosed().subscribe(item => {
          this.obtenerPlanHorarios(parseInt(this.idEmpleado));
        });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
        timeOut: 6000,
      })
    });
  }

  /* Ventana para registrar detalle de horario del empleado*/
  AbrirVentanaDetallePlanHorario(datos: any): void {
    console.log(datos);
    this.vistaRegistrarDatos.open(RegistroDetallePlanHorarioComponent,
      { width: '350px', data: { idEmpleado: this.idEmpleado, planHorario: datos, actualizarPage: false, direccionarE: false } }).disableClose = true;
  }

  /* Ventana para ingresar planificación de comidas */
  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado })
      .afterClosed().subscribe(item => {
        this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para ingresar procesos del empleado */
  AbrirVentanaProcesos(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistrarEmpleProcesoComponent,
        { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } }).afterClosed().subscribe(item => {
          this.obtenerEmpleadoProcesos(parseInt(this.idEmpleado));
        });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
        timeOut: 6000,
      })
    });
  }

  /* Ventana para registrar autorizaciones de diferentes departamentos */
  AbrirVentanaAutorizar(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistroAutorizacionDepaComponent,
        { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } }).afterClosed().subscribe(item => {
          this.ObtenerAutorizaciones(parseInt(this.idEmpleado));
        });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
        timeOut: 6000,
      })
    });
  }

  /* Ventana para registrar permisos del empleado */
  AbrirVentanaPermiso(): void {
    this.restEmpleado.BuscarIDContratoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idContrato ", this.idContrato[0].max)

      this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idCargo = datos;

        this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
          this.idPerVacacion = datos;
          console.log("idPerVaca ", this.idPerVacacion[0].id)
          this.vistaRegistrarDatos.open(RegistroEmpleadoPermisoComponent,
            {
              width: '1200px',
              data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].max, idPerVacacion: this.idPerVacacion[0].id, idCargo: this.idCargo[0].max }
            }).afterClosed().subscribe(item => {
              this.obtenerPermisos(parseInt(this.idEmpleado));
            });
        }, error => {
          this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones', {
            timeOut: 6000,
          })
        });
      }, error => {
        this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
          timeOut: 6000,
        })
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato', {
        timeOut: 6000,
      })
    });
  }

  AbrirVentanaHoraExtra() {
    this.vistaRegistrarDatos.open(PedidoHoraExtraComponent, { width: '9iipx' })
      .afterClosed().subscribe(items => {
        this.ObtenerlistaHorasExtrasEmpleado();
      });
  }

  /* 
   * ***************************************************************************************************
   *                               VENTANA PARA EDITAR DATOS
   * ***************************************************************************************************
  */
  /* Ventana para editar procesos del empleado */
  AbrirVentanaEditarProceso(datoSeleccionado: any): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarEmpleadoProcesoComponent,
      { width: '400px', data: { idEmpleado: this.idEmpleado, datosProcesos: datoSeleccionado } })
      .afterClosed().subscribe(item => {
        this.obtenerEmpleadoProcesos(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para editar procesos del empleado */
  AbrirEditarPeriodoVacaciones(datoSeleccionado: any): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarPeriodoVacacionesComponent,
      { width: '900px', data: { idEmpleado: this.idEmpleado, datosPeriodo: datoSeleccionado } })
      .afterClosed().subscribe(item => {
        this.obtenerPeriodoVacaciones(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para editar horario del empleado */
  AbrirEditarHorario(datoSeleccionado: any): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarHorarioEmpleadoComponent,
      { width: '600px', data: { idEmpleado: this.idEmpleado, datosHorario: datoSeleccionado } })
      .afterClosed().subscribe(item => {
        this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para registrar horario */
  AbrirEditarPlanificacion(datoSeleccionado: any): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarPlanificacionComponent,
      { width: '300px', data: { idEmpleado: this.idEmpleado, datosPlan: datoSeleccionado } }).afterClosed().subscribe(item => {
        this.obtenerPlanHorarios(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para editar planificación de comidas */
  AbrirEditarPlanComidas(datoSeleccionado): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarPlanComidasComponent, { width: '600px', data: datoSeleccionado })
      .afterClosed().subscribe(item => {
        this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
      });
  }

  /* Ventana para editar autorizaciones de diferentes departamentos */
  AbrirEditarAutorizar(datoSeleccionado): void {
    console.log('datos auto', datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarAutorizacionDepaComponent,
      { width: '600px', data: { idEmpleado: this.idEmpleado, datosAuto: datoSeleccionado } }).afterClosed().subscribe(item => {
        this.ObtenerAutorizaciones(parseInt(this.idEmpleado));
      });
  }

  EditarHoraExtra(h) {
    this.vistaRegistrarDatos.open(EditarHoraExtraEmpleadoComponent, { width: '900px', data: h }).afterClosed().subscribe(items => {
      console.log(items);
      if (items === true) {
        this.ObtenerlistaHorasExtrasEmpleado();
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

  EditarVacaciones(v) {
    this.vistaRegistrarDatos.open(EditarVacacionesEmpleadoComponent, { width: '900px', data: v }).afterClosed().subscribe(items => {
      this.obtenerVacaciones(parseInt(this.idEmpleado));
    });
  }

  /* 
  ****************************************************************************************************
  *                               PARA LA GENERACION DE PDFs
  ****************************************************************************************************
  */
  generarPdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinicion();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  getDocumentDefinicion() {
    sessionStorage.setItem('profile', this.empleadoUno);
    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // Formato de hora actual
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logoE, width: 150, margin: [10, -25, 0, 5] },
        { text: 'Perfil Empleado', bold: true, fontSize: 20, alignment: 'center', margin: [0, -30, 0, 10] },
        {
          columns: [
            [
              { text: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido, style: 'name' },
              { text: 'Fecha Nacimiento: ' + this.fechaNacimiento },
              { text: 'Corre Electronico: ' + this.empleadoUno[0].correo },
              { text: 'Teléfono: ' + this.empleadoUno[0].telefono }
            ]
          ]
        },
        { text: 'Contrato Empleado', style: 'header' },
        this.presentarDataPDFcontratoEmpleado(),
        { text: 'Plan de comidas', style: 'header' },
        { text: 'Titulos', style: 'header' },
        this.presentarDataPDFtitulosEmpleado(),
        { text: 'Discapacidad', style: 'header' },
        this.presentarDataPDFdiscapacidadEmpleado(),
      ],
      info: {
        title: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido + '_PERFIL',
        author: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido,
        subject: 'Perfil',
        keywords: 'Perfil, Empleado',
      },
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 20, 0, 10], decoration: 'underline' },
        name: { fontSize: 16, bold: true },
        tableHeader: { bold: true, alignment: 'center', fillColor: this.p_color }
      }
    };
  }

  presentarDataPDFtitulosEmpleado() {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [
          [
            { text: 'Observaciones', style: 'tableHeader' },
            { text: 'Nombre', style: 'tableHeader' },
            { text: 'Nivel', style: 'tableHeader' }
          ],
          ...this.relacionTituloEmpleado.map(obj => {
            return [obj.observaciones, obj.nombre, obj.nivel];
          })
        ]
      }
    };
  }

  presentarDataPDFcontratoEmpleado() {
    return {
      table: {
        widths: ['*', 'auto', 100, '*'],
        body: [
          [
            { text: 'Descripción', style: 'tableHeader' },
            { text: 'Dias Vacacion', style: 'tableHeader' },
            { text: 'Fecha Ingreso', style: 'tableHeader' },
            { text: 'Fecha Salida', style: 'tableHeader' }
          ],
          ...this.contratoEmpleadoRegimen.map(obj => {
            const ingreso = obj.fec_ingreso.split("T")[0];
            if (obj.fec_salida === null) {
              const salida = '';
              return [obj.descripcion, obj.dia_anio_vacacion, ingreso, salida];
            } else {
              const salida = obj.fec_salida.split("T")[0];
              return [obj.descripcion, obj.dia_anio_vacacion, ingreso, salida];
            }
          })
        ]
      }
    };

  }

  presentarDataPDFdiscapacidadEmpleado() {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [
          [
            { text: 'Carnet conadis', style: 'tableHeader' },
            { text: 'Porcentaje', style: 'tableHeader' },
            { text: 'Tipo', style: 'tableHeader' }
          ],
          ...this.discapacidadUser.map(obj => {
            return [obj.carn_conadis, obj.porcentaje + ' %', obj.tipo];
          })
        ]
      }
    };
  }

  /* 
  ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL
  ****************************************************************************************************
  */

  exportToExcel() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleadoUno);
    const wsc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.contratoEmpleadoRegimen);
    const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relacionTituloEmpleado);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'perfil');
    xlsx.utils.book_append_sheet(wb, wsc, 'contrato');
    xlsx.utils.book_append_sheet(wb, wst, 'titulos');
    xlsx.utils.book_append_sheet(wb, wsd, 'discapacida');
    xlsx.writeFile(wb, "EmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS CSV
   * ***************************************************************************************************
  */

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleadoUno);
    const wsc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.contratoEmpleadoRegimen);
    const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relacionTituloEmpleado);
    const csvDataE = xlsx.utils.sheet_to_csv(wse);
    const csvDataC = xlsx.utils.sheet_to_csv(wsc);
    const csvDataD = xlsx.utils.sheet_to_csv(wsd);
    const csvDataT = xlsx.utils.sheet_to_csv(wst);
    const data: Blob = new Blob([csvDataE, csvDataC, csvDataD, csvDataT], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpleadoCSV" + new Date().getTime() + '.csv');
  }

  /* 
  ****************************************************************************************************
  *                               PARA LA SUBIR LA IMAGEN DEL EMPLEADO
  ****************************************************************************************************
  */
  nameFile: string;
  archivoSubido: Array<File>;
  archivoForm = new FormControl('');

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.plantilla();
  }

  plantilla() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      console.log(this.archivoSubido[i], this.archivoSubido[i].name)
      formData.append("image[]", this.archivoSubido[i], this.archivoSubido[i].name);
      console.log("iamge", formData);
    }
    this.restEmpleado.subirImagen(formData, parseInt(this.idEmpleado)).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'imagen subida.', {
        timeOut: 6000,
      });
      this.verEmpleado(this.idEmpleado)
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  /* ****************************************************************************************************
   *                               CARGAR HORARIOS DEL EMPLEADO CON PLANTILLA
   * ****************************************************************************************************/
  nameFileHorario: string;
  archivoSubidoHorario: Array<File>;
  archivoHorarioForm = new FormControl('');

  fileChangeHorario(element) {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      this.archivoSubidoHorario = element.target.files;
      this.nameFileHorario = this.archivoSubidoHorario[0].name;
      let arrayItems = this.nameFileHorario.split(".");
      let itemExtencion = arrayItems[arrayItems.length - 1];
      let itemName = arrayItems[0].slice(0, 16);
      console.log(itemName.toLowerCase());
      if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
        if (itemName.toLowerCase() == 'horario empleado') {
          this.plantillaHorario();
          //this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
        } else {
          this.toastr.error('Plantilla seleccionada incorrecta', '', {
            timeOut: 6000,
          });
          this.archivoHorarioForm.reset();
          this.nameFileHorario = '';
        }
      } else {
        this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada', {
          timeOut: 6000,
        });
        this.archivoHorarioForm.reset();
        this.nameFileHorario = '';
      }
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo', {
        timeOut: 6000,
      })
       this.archivoHorarioForm.reset();
                this.nameFileHorario = '';
    });
  }

  plantillaHorario() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoHorario.length; i++) {
      formData.append("uploads[]", this.archivoSubidoHorario[i], this.archivoSubidoHorario[i].name);
      console.log("toda la data", this.archivoSubidoHorario[i])
    }
    this.restEmpleHorario.VerificarDatos_EmpleadoHorario(formData, parseInt(this.idEmpleado)).subscribe(res => {
      console.log('entra')
      if (res.message === 'error') {
        this.toastr.error('Para el buen funcionamiento del sistema verificar los datos de la plantilla. ' +
          'Recuerde que el horario indicado debe estar registrado en el sistema y debe tener su respectivo detalle de horario, ' +
          'el empleado debe tener registrado un contrato de trabajo y las fechas indicadas no deben estar duplicadas dentro del sistema. ' +
          'Las fechas deben estar ingresadas correctamente, la fecha de inicio no debe ser posterior a la fecha final.', 'Verificar Plantilla', {
          timeOut: 6000,
        });
        this.archivoHorarioForm.reset();
        this.nameFileHorario = '';
      }
      else {
        this.restEmpleHorario.VerificarPlantilla_EmpleadoHorario(formData).subscribe(resD => {
          if (resD.message === 'error') {
            this.toastr.error('Para el buen funcionamiento del sistema verificar los datos de la plantilla. ' +
              'Recuerde que el horario indicado debe estar registrado en el sistema y debe tener su respectivo detalle de horario, ' +
              'el empleado debe tener registrado un contrato de trabajo y las fechas indicadas no deben estar duplicadas dentro del sistema.', 'Verificar Plantilla', {
              timeOut: 6000,
            });
            this.archivoHorarioForm.reset();
            this.nameFileHorario = '';
          }
          else {
            this.restEmpleHorario.SubirArchivoExcel(formData, parseInt(this.idEmpleado), parseInt(this.empleadoUno[0].codigo)).subscribe(resC => {

              this.restEmpleHorario.CreaPlanificacion(formData, parseInt(this.idEmpleado), parseInt(this.empleadoUno[0].codigo)).subscribe(resP => {
                this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.', {
                  timeOut: 6000,
                });
                this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
              //this.actualizar = false;
              //window.location.reload(this.actualizar);
              this.archivoHorarioForm.reset();
              this.nameFileHorario = '';
              });
              /*this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
              //this.actualizar = false;
              //window.location.reload(this.actualizar);
              this.archivoHorarioForm.reset();
              this.nameFileHorario = '';*/
            });
          }
        });
      }
    }, error  => {
      console.log('entra', error)
    });
  }

  /* ***************************************************************************************************** 
   *                              MÉTODO PARA IMPRIMIR EN XML
   * *****************************************************************************************************/
  nacionalidades: any = [];
  obtenerNacionalidades() {
    this.restEmpleado.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
  }

  EstadoCivilSelect: any = ['Soltero/a', 'Unión de Hecho', 'Casado/a', 'Divorciado/a', 'Viudo/a'];
  GeneroSelect: any = ['Masculino', 'Femenino'];
  EstadoSelect: any = ['Activo', 'Inactivo'];

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloEmpleado = [];
    this.empleadoUno.forEach(obj => {
      var estadoCivil = this.EstadoCivilSelect[obj.esta_civil - 1];
      var genero = this.GeneroSelect[obj.genero - 1];
      var estado = this.EstadoSelect[obj.estado - 1];
      let nacionalidad;
      this.nacionalidades.forEach(element => {
        if (obj.id_nacionalidad == element.id) {
          nacionalidad = element.nombre;
        }
      });

      objeto = {
        "empleado": {
          '@codigo': obj.codigo,
          "cedula": obj.cedula,
          "apellido": obj.apellido,
          "nombre": obj.nombre,
          "estadoCivil": estadoCivil,
          "genero": genero,
          "correo": obj.correo,
          "fechaNacimiento": obj.fec_nacimiento.split("T")[0],
          "estado": estado,
          "correoAlternativo": obj.mail_alternativo,
          "domicilio": obj.domicilio,
          "telefono": obj.telefono,
          "nacionalidad": nacionalidad,
          "imagen": obj.imagen
        }
      }
      arregloEmpleado.push(objeto)
    });

    this.restEmpleado.DownloadXMLRest(arregloEmpleado).subscribe(res => {
      this.data = res;
      this.urlxml = 'http://localhost:3000/empleado/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

  /** HABILITAR O DESHABILITAR VISTA DE ACCIONES DE PERSONAL */
  VerAccionPersonal() {
    this.restEmpresa.ConsultarEmpresas().subscribe(res => {
      if (res[0].tipo_empresa === 'Pública') {
        this.HabilitarAccion = false;
      }
      else {
        this.HabilitarAccion = true;
      }
    })
  }

  VerHorasExtras() {
    if (this.idEmpleadoLogueado === parseInt(this.idEmpleado)) {
      this.HabilitarHorasE = false;
    }
    else {
      this.HabilitarHorasE = true;
    }
  }

  /* Ventana para ingresar planificación de comidas */
  CambiarContrasena(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(CambiarContrasenaComponent, { width: '350px', data: this.idEmpleado }).disableClose = true;
  }

  usuario: any = [];
  activar: boolean = false;
  VerAccionContrasena(idEmpleado) {
    this.usuario = [];
    this.restU.BuscarDatosUser(idEmpleado).subscribe(res => {
      this.usuario = res;
      if (this.usuario[0].id_rol === 1) {
        this.activar = true;
      }
      else {
        this.activar = false;
      }
    });

  }


}

