import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-planificacion-comidas',
  templateUrl: './planificacion-comidas.component.html',
  styleUrls: ['./planificacion-comidas.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class PlanificacionComidasComponent implements OnInit {

  idComidaF = new FormControl('', Validators.required);
  idEmpleadoF = new FormControl('');
  fechaF = new FormControl('', [Validators.required]);
  observacionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  fechaInicioF = new FormControl('', Validators.required);
  fechaFinF = new FormControl('', Validators.required);
  horaInicioF = new FormControl('', Validators.required);
  horaFinF = new FormControl('', Validators.required);
  tipoF = new FormControl('', Validators.required);;
  platosF = new FormControl('', Validators.required);;
  extraF = new FormControl('', [Validators.required]);

  // asignar los campos en un formulario en grupo
  public PlanificacionComidasForm = new FormGroup({
    idComidaForm: this.idComidaF,
    idEmpleadoForm: this.idEmpleadoF,
    fechaForm: this.fechaF,
    observacionForm: this.observacionF,
    fechaInicioForm: this.fechaInicioF,
    fechaFinForm: this.fechaFinF,
    horaInicioForm: this.horaInicioF,
    horaFinForm: this.horaFinF,
    tipoForm: this.tipoF,
    platosForm: this.platosF,
    extraForm: this.extraF
  });

  tipoComidas: any = [];
  empleados: any = [];
  FechaActual: any;
  idEmpleadoLogueado: any;

  constructor(
    private toastr: ToastrService,
    private rest: TipoComidasService,
    public restE: EmpleadoService,
    public restPlan: PlanComidasService,
    public restUsuario: UsuarioService,
    public dialogRef: MatDialogRef<PlanificacionComidasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    console.log('datos', this.data, this.data.servicios)
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    this.MostrarDatos();
    this.ObtenerServicios();
  }

  verNombre: boolean = false;
  descripcion: string;
  empleado_recibe: number;
  empleado_envia: number;
  MostrarDatos() {
    if (this.data.modo === 'individual') {
      this.verNombre = true;
      this.ObtenerEmpleados(this.data.idEmpleado);
    }
    else {
      this.PlanificacionComidasForm.patchValue({
        fechaForm: this.FechaActual
      });
    }
    this.restUsuario.BuscarDatosUser(parseInt(this.idEmpleadoLogueado)).subscribe(data => {
      if (this.data.modo === 'individual') {
        this.empleado_envia = this.idEmpleadoLogueado;
        this.empleado_recibe = this.data.idEmpleado;
      }
      else {
        this.empleado_envia = this.idEmpleadoLogueado;
      }
    });
  }

  servicios: any = [];
  ObtenerServicios() {
    this.servicios = [];
    this.restPlan.ObtenerTipoComidas().subscribe(datos => {
      this.servicios = datos;
    })
  }

  // Al seleccionar un tipo de servicio se muestra la lista de menús registrados
  ObtenerPlatosComidas(form) {
    this.idComidaF.reset();
    this.platosF.reset();
    this.tipoComidas = [];
    this.rest.ConsultarMenu(form.tipoForm).subscribe(datos => {
      this.tipoComidas = datos;
    }, error => {
      this.toastr.info('Verificar la información.', 'No existen registrados Menús para esta tipo de servicio.', {
        timeOut: 6000,
      })
    })
  }

  detalle: any = [];
  ObtenerDetalleMenu(form) {
    this.platosF.reset();
    this.detalle = [];
    this.rest.ConsultarUnDetalleMenu(form.idComidaForm).subscribe(datos => {
      this.detalle = datos;
    }, error => {
      this.toastr.info('Verificar la información.', 'No existen registros de Alimentación para este Menú.', {
        timeOut: 6000,
      })
    })
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleados = data;
      console.log(this.empleados)
      this.PlanificacionComidasForm.patchValue({
        idEmpleadoForm: this.empleados[0].nombre + ' ' + this.empleados[0].apellido,
        fechaForm: this.FechaActual
      })
    })
  }

  contador: number = 0;
  InsertarPlanificacion(form) {
    let datosPlanComida = {
      fecha: form.fechaForm,
      id_comida: form.platosForm,
      observacion: form.observacionForm,
      fec_comida: form.fechaInicioForm,
      hora_inicio: form.horaInicioForm,
      hora_fin: form.horaFinForm,
      extra: form.extraForm,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinForm,
    };
    if (this.data.modo === "multiple") {
      // CREACIÓN DE LA PLANIFICACIÓN PARA VARIOS EMPLEADOS
      this.restPlan.CrearPlanComidas(datosPlanComida).subscribe(res => {
      });
      // CONSULTAMOS EL ID DE LA ÚLTIMA PLANIFICACIÓN CREADA
      this.restPlan.ObtenerUltimaPlanificacion().subscribe(res => {
        console.log('ultima planificacion', res[0].ultimo);
        // INDICAMOS A QUE EMPLEADO SE LE REALIZA UNA PLANIFICACIÓN
        this.contador = 0;
        this.data.servicios.map(obj => {
          let datosPlanEmpleado = {
            codigo: obj.codigo,
            id_empleado: obj.id,
            id_plan_comida: res[0].ultimo
          }
          this.restPlan.CrearPlanComidasEmpleado(datosPlanEmpleado).subscribe(res => {
            this.EnviarNotificaciones(form.fechaPlanificacionForm, form.horaInicioForm, form.horaFinForm, this.empleado_envia, obj.id);
            this.contador = this.contador + 1;
            if (this.contador === this.data.servicios.length) {
              this.dialogRef.close();
              window.location.reload();
              this.toastr.success('Operación Exitosa', 'Se registra un total de  ' + this.data.servicios.length + ' Servicios de Alimetación Planificados.', {
                timeOut: 6000,
              })
            }
          });
        })
      });
    }
    else {
      // CREACIÓN DE LA PLANIFICACIÓN PARA UN EMPLEADO
      this.restPlan.CrearPlanComidas(datosPlanComida).subscribe(res => {
      });
      // CONSULTAMOS EL ID DE LA ÚLTIMA PLANIFICACIÓN CREADA
      this.restPlan.ObtenerUltimaPlanificacion().subscribe(res => {
        console.log('ultima planificacion', res[0].ultimo);
        // INDICAMOS A QUE EMPLEADO SE LE REALIZA UNA PLANIFICACIÓN
        let datosPlanEmpleado = {
          codigo: this.empleados[0].codigo,
          id_empleado: this.data.idEmpleado,
          id_plan_comida: res[0].ultimo
        }
        this.restPlan.CrearPlanComidasEmpleado(datosPlanEmpleado).subscribe(response => {
          this.EnviarNotificaciones(form.fechaPlanificacionForm, form.horaInicioForm, form.horaFinForm, this.empleado_envia, this.empleado_recibe);
          this.toastr.success('Operación Exitosa', 'Servicio de Alimentación Registrado.', {
            timeOut: 6000,
          })
          this.CerrarRegistroPlanificacion();
        });
      });
    }
  }

  ObtenerMensajeErrorObservacion() {
    if (this.observacionF.hasError('pattern')) {
      return 'Ingrese información válida';
    }
    return this.observacionF.hasError('required') ? 'Campo Obligatorio' : '';
  }

  CerrarRegistroPlanificacion() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  LimpiarCampos() {
    this.PlanificacionComidasForm.reset();
    this.ObtenerServicios();
  }

  envios: any = [];
  EnviarNotificaciones(fecha_plan, h_inicio, h_fin, empleado_envia, empleado_recibe) {
    let datosCorreo = {
      id_usua_plan: empleado_recibe,
      id_usu_admin: empleado_envia,
      fecha: moment(fecha_plan).format('DD-MM-YYYY'),
      hora_inicio: h_inicio,
      hora_fin: h_fin
    }
    this.restPlan.EnviarCorreoPlan(datosCorreo).subscribe(envio => {
      this.envios = [];
      this.envios = envio;
      console.log('datos envio', this.envios.notificacion);
      if (this.envios.notificacion === true) {
        this.NotificarPlanificacion(empleado_envia, empleado_recibe, fecha_plan);
      }
    });
  }

  NotificarPlanificacion(empleado_envia: any, empleado_recive: any, fecha) {
    let mensaje = {
      id_empl_envia: empleado_envia,
      id_empl_recive: empleado_recive,
      mensaje: 'Alimentación Planificada para ' + moment(fecha).format('YYYY-MM-DD')
    }
    console.log(mensaje);
    this.restPlan.EnviarMensajePlanComida(mensaje).subscribe(res => {
      console.log(res.message);
    })
  }


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

}
