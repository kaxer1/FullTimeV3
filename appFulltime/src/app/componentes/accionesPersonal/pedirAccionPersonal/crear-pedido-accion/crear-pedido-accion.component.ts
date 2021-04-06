import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { AccionPersonalService } from 'src/app/servicios/accionPersonal/accion-personal.service';

@Component({
  selector: 'app-crear-pedido-accion',
  templateUrl: './crear-pedido-accion.component.html',
  styleUrls: ['./crear-pedido-accion.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class CrearPedidoAccionComponent implements OnInit {

  // FILTRO DE NOMBRES DE LOS EMPLEADOS
  filtroNombre: Observable<string[]>;
  filtroNombreH: Observable<string[]>;
  filtroNombreG: Observable<string[]>;
  seleccionarEmpleados: any;
  seleccionEmpleadoH: any;
  seleccionEmpleadoG: any;

  // EVENTOS RELACIONADOS A SELECCIÓN E INGRESO DE ACUERDOS - DECRETOS - RESOLUCIONES
  vistaAcuerdo: boolean = true;
  ingresoAcuerdo: boolean = false;

  // EVENTOS REALCIONADOS A SELECCIÓN E INGRESO DE CARGOS PROPUESTOS
  vistaCargo: boolean = true;
  ingresoCargo: boolean = false;

  // EVENTOS RELACIONADOS A SELECCIÓN E INGRESO DE PROCESOS PROPUESTOS
  vistaProceso: boolean = true;
  ingresoProceso: boolean = false;

  // INICIACIÓN DE CAMPOS DEL FORMULARIO
  idEmpleadoF = new FormControl('');
  fechaF = new FormControl('', [Validators.required]);
  fechaDesdeF = new FormControl('', [Validators.required]);
  fechaHastaF = new FormControl('');
  identificacionF = new FormControl('', [Validators.required, Validators.minLength(3)]);
  numPartidaF = new FormControl('', [Validators.required]);
  tipoDecretoF = new FormControl('');
  otroDecretoF = new FormControl('', [Validators.minLength(3)]);
  idEmpleadoHF = new FormControl('');
  idEmpleadoGF = new FormControl('');
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  baseF = new FormControl('', [Validators.minLength(6)]);
  tipoCargoF = new FormControl('');
  otroCargoF = new FormControl('', [Validators.minLength(3)]);
  tipoProcesoF = new FormControl('');
  otroProcesoF = new FormControl('', [Validators.minLength(3)]);
  numPropuestaF = new FormControl('', [Validators.required]);
  sueldoF = new FormControl('');

  // ASIGNAR LOS CAMPOS DEL FORMULARIO EN UN GRUPO
  public PlanificacionComidasForm = new FormGroup({
    idEmpleadoForm: this.idEmpleadoF,
    fechaForm: this.fechaF,
    fechaDesdeForm: this.fechaDesdeF,
    fechaHastaForm: this.fechaHastaF,
    identificacionForm: this.identificacionF,
    numPartidaForm: this.numPartidaF,
    tipoDecretoForm: this.tipoDecretoF,
    otroDecretoForm: this.otroDecretoF,
    idEmpleadoHForm: this.idEmpleadoHF,
    idEmpleadoGForm: this.idEmpleadoGF,
    descripcionForm: this.descripcionF,
    baseForm: this.baseF,
    tipoCargoForm: this.tipoCargoF,
    otroCargoForm: this.otroCargoF,
    tipoProcesoForm: this.tipoProcesoF,
    otroProcesoForm: this.otroProcesoF,
    numPropuestaForm: this.numPropuestaF,
    sueldoForm: this.sueldoF,
  });

  // INICIACIÓN DE VARIABLES 
  empleados: any = [];
  FechaActual: any;
  idEmpleadoLogueado: any;
  departamento: any;

  constructor(
    private toastr: ToastrService,
    public restE: EmpleadoService,
    public restEmpresa: EmpresaService,
    public restAccion: AccionPersonalService,
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
    this.departamento = parseInt(localStorage.getItem("departamento"));
  }

  ngOnInit(): void {
    var f = moment();
    this.FechaActual = f.format('DD-MM-YYYY');
    this.PlanificacionComidasForm.patchValue({
      fechaForm: this.FechaActual
    });
    this.MostrarDatos();
    this.ObtenerDecretos();
    this.decretos[this.decretos.length] = { descripcion: "OTRO" };
    this.ObtenerEmpleados();
    this.filtroNombre = this.idEmpleadoF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filtrarEmpleado(value))
      );
    this.filtroNombreH = this.idEmpleadoHF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filtrarEmpleado(value))
      );
    this.filtroNombreG = this.idEmpleadoGF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filtrarEmpleado(value))
      );
    this.ObtenerTiposAccion();
    this.ObtenerCargos();
    this.cargos[this.cargos.length] = { descripcion: "OTRO" };
    this.ObtenerProcesos();
    this.procesos[this.procesos.length] = { descripcion: "OTRO" };
  }

  private _filtrarEmpleado(value: string): string[] {
    if (value != null) {
      const filterValue = value.toUpperCase();
      return this.empleados.filter(info => info.empleado.toUpperCase().includes(filterValue));
    }
  }

  empresa: any = [];
  MostrarDatos() {
    this.empresa = [];
    this.restEmpresa.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(data => {
      this.empresa = data;
      this.PlanificacionComidasForm.patchValue({
        numPartidaForm: this.empresa[0].num_partida
      });
    });
  }

  decretos: any = [];
  ObtenerDecretos() {
    this.decretos = [];
    this.restAccion.ConsultarDecreto().subscribe(datos => {
      this.decretos = datos;
      this.decretos[this.decretos.length] = { descripcion: "OTRO" };
    })
  }

  estilo: any;
  IngresarOtro(form) {
    if (form.tipoDecretoForm === undefined) {
      this.PlanificacionComidasForm.patchValue({
        otroDecretoForm: '',
      });
      this.estilo = { 'visibility': 'visible' }; this.ingresoAcuerdo = true;
      this.toastr.info('Ingresar nombre de un nuevo tipo de proceso', '', {
        timeOut: 6000,
      })
      this.vistaAcuerdo = false;
    }
  }

  VerDecretos() {
    this.PlanificacionComidasForm.patchValue({
      otroDrecretoForm: '',
    });
    this.estilo = { 'visibility': 'hidden' }; this.ingresoAcuerdo = false;
    this.vistaAcuerdo = true;
  }

  tipos_accion: any = [];
  ObtenerTiposAccion() {
    this.tipos_accion = [];
    this.restAccion.ConsultarTipoAccionPersonal().subscribe(datos => {
      this.tipos_accion = datos;
    })
  }

  cargos: any = [];
  ObtenerCargos() {
    this.cargos = [];
    this.restAccion.ConsultarCargoPropuesto().subscribe(datos => {
      this.cargos = datos;
      this.cargos[this.cargos.length] = { descripcion: "OTRO" };
    })
  }

  estiloC: any;
  IngresarCargo(form) {
    if (form.tipoCargoForm === undefined) {
      this.PlanificacionComidasForm.patchValue({
        otroCargoForm: '',
      });
      this.estiloC = { 'visibility': 'visible' }; this.ingresoCargo = true;
      this.toastr.info('Ingresar nombre de un nuevo tipo de cargo o puesto propuesto.', '', {
        timeOut: 6000,
      })
      this.vistaCargo = false;
    }
  }

  VerCargos() {
    this.PlanificacionComidasForm.patchValue({
      otroCargoForm: '',
    });
    this.estiloC = { 'visibility': 'hidden' }; this.ingresoCargo = false;
    this.vistaCargo = true;
  }

  procesos: any = [];
  ObtenerProcesos() {
    this.procesos = [];
    this.restAccion.ConsultarProcesoPropuesto().subscribe(datos => {
      this.procesos = datos;
      this.procesos[this.procesos.length] = { descripcion: "OTRO" };
    })
  }

  estiloP: any;
  IngresarProceso(form) {
    if (form.tipoProcesoForm === undefined) {
      this.PlanificacionComidasForm.patchValue({
        otroProcesoForm: '',
      });
      this.estiloC = { 'visibility': 'visible' }; this.ingresoProceso = true;
      this.toastr.info('Ingresar nombre de un nuevo tipo de proceso propuesto.', '', {
        timeOut: 6000,
      })
      this.vistaProceso = false;
    }
  }

  VerProcesos() {
    this.PlanificacionComidasForm.patchValue({
      otroProcesosForm: '',
    });
    this.estiloP = { 'visibility': 'hidden' }; this.ingresoProceso = false;
    this.vistaProceso = true;
  }

  // MÉTODO PARA OBTENER LISTA DE EMPLEADOS
  ObtenerEmpleados() {
    this.empleados = [];
    this.restE.getBuscadorEmpledosRest().subscribe(data => {
      this.empleados = data;
      this.seleccionarEmpleados = '';
      this.seleccionEmpleadoH = '';
      this.seleccionEmpleadoG = '';
      console.log('empleados', this.empleados)
    })
  }

  InsertarAccionPersonal(form) {

  }

  /* contador: number = 0;
   InsertarPlanificacion(form) {
     let datosPlanComida = {
       id_empleado: this.data.idEmpleado,
       fecha: form.fechaForm,
       id_comida: form.platosForm,
       observacion: form.observacionForm,
       fec_comida: form.fechaPlanificacionForm,
       hora_inicio: form.horaInicioForm,
       hora_fin: form.horaFinForm,
       extra: form.extraForm
     };
     this.restPlan.CrearSolicitudComida(datosPlanComida).subscribe(response => {
       this.EnviarNotificaciones(form.fechaPlanificacionForm);
       this.toastr.success('Operación Exitosa', 'Servicio de Alimentación Registrado.', {
         timeOut: 6000,
       })
       this.CerrarRegistroPlanificacion();
     });
   }*/

  ObtenerMensajeErrorDescripcion() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Ingrese información válida';
    }
  }

  CerrarRegistroPlanificacion() {
    this.LimpiarCampos();
  }

  LimpiarCampos() {
    this.PlanificacionComidasForm.reset();
    this.ObtenerDecretos();
  }


  /*  jefes: any = [];
    envios: any = [];
    EnviarNotificaciones(fecha) {
      this.restPlan.obtenerJefes(this.departamento).subscribe(data => {
        this.jefes = [];
        this.jefes = data;
        this.jefes.map(obj => {
          let datosCorreo = {
            id_usua_solicita: this.data.idEmpleado,
            correo: obj.correo,
            comida_mail: obj.comida_mail,
            comida_noti: obj.comida_noti
          }
          this.restPlan.EnviarCorreo(datosCorreo).subscribe(envio => {
            this.envios = [];
            this.envios = envio;
            console.log('datos envio', this.envios.notificacion);
            if (this.envios.notificacion === true) {
              this.NotificarPlanificacion(this.data.idEmpleado, obj.empleado, fecha);
            }
          });
        })
      });
    }
  
    NotificarPlanificacion(empleado_envia: any, empleado_recive: any, fecha) {
      let mensaje = {
        id_empl_envia: empleado_envia,
        id_empl_recive: empleado_recive,
        mensaje: 'Solicitó Alimentación ' + ' para ' + moment(fecha).format('YYYY-MM-DD')
      }
      console.log(mensaje);
      this.restPlan.EnviarMensajePlanComida(mensaje).subscribe(res => {
        console.log(res.message);
      })
    }*/

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
      return false;
    }
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

}
