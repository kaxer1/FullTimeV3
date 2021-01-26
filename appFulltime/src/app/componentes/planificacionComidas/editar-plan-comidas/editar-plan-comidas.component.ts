import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';

@Component({
  selector: 'app-editar-plan-comidas',
  templateUrl: './editar-plan-comidas.component.html',
  styleUrls: ['./editar-plan-comidas.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class EditarPlanComidasComponent implements OnInit {

  idComidaF = new FormControl('', Validators.required);
  idEmpleadoF = new FormControl('', [Validators.required]);
  fechaF = new FormControl('', [Validators.required]);
  observacionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  fechaPlanificacionF = new FormControl('', Validators.required);
  horaInicioF = new FormControl('', Validators.required);
  horaFinF = new FormControl('', Validators.required);
  tipoF = new FormControl('');
  servicioF = new FormControl('', [Validators.minLength(3)]);
  extraF = new FormControl('', [Validators.required]);

  // asignar los campos en un formulario en grupo
  public PlanificacionComidasForm = new FormGroup({
    idComidaForm: this.idComidaF,
    idEmpleadoForm: this.idEmpleadoF,
    fechaForm: this.fechaF,
    observacionForm: this.observacionF,
    fechaPlanificacionForm: this.fechaPlanificacionF,
    horaInicioForm: this.horaInicioF,
    horaFinForm: this.horaFinF,
    servicioForm: this.servicioF,
    tipoForm: this.tipoF,
    extraForm: this.extraF
  });

  tipoComidas: any = [];
  empleados: any = [];

  FechaActual: any;

  idEmpleadoLogueado: any;

  selec1: boolean = false;
  selec2: boolean = false;

  constructor(
    private toastr: ToastrService,
    private rest: TipoComidasService,
    public restE: EmpleadoService,
    public restPlan: PlanComidasService,
    public dialogRef: MatDialogRef<EditarPlanComidasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    console.log('datos', this.data)
    this.ObtenerPlatosComidas();
    this.ObtenerServicios();
    this.servicios[this.servicios.length] = { nombre: "OTRO" };
    this.ObtenerEmpleados(this.data.id_empleado);
    this.CargarDatos();
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

  ObtenerPlatosComidas() {
    this.tipoComidas = [];
    this.rest.ConsultarTipoComida().subscribe(datos => {
      this.tipoComidas = datos;
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
        fechaForm: this.data.fecha
      })
    })
  }

  InsertarPlanificacion(form) {
    let datosPlanComida = {
      id_empleado: this.data.id_empleado,
      fecha: form.fechaForm,
      id_comida: form.idComidaForm,
      observacion: form.observacionForm,
      fec_solicita: form.fechaPlanificacionForm,
      hora_inicio: form.horaInicioForm,
      hora_fin: form.horaFinForm,
      tipo_comida: form.tipoForm,
      extra: form.extraForm,
      id: this.data.id
    };
    if (form.tipoForm === undefined) {
      this.RegistrarServicio(form, datosPlanComida);
    }
    else {
      this.restPlan.ActualizarDatos(datosPlanComida).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Planificación de Almuerzo Actualizado', {
          timeOut: 6000,
        })
        this.CerrarRegistroPlanificacion();
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
    //window.location.reload();
  }

  LimpiarCampos() {
    this.PlanificacionComidasForm.reset();
    this.ObtenerPlatosComidas();
    this.ObtenerServicios();
    this.servicios[this.servicios.length] = { nombre: "OTRO" };
  }

  CargarDatos() {
    this.PlanificacionComidasForm.patchValue({
      idComidaForm: this.data.id_tipo_comida,
      observacionForm: this.data.observacion,
      fechaPlanificacionForm: this.data.fec_solicita,
      horaInicioForm: this.data.hora_inicio,
      horaFinForm: this.data.hora_fin,
      tipoForm: this.data.id_servicio
    })
    if (this.data.extra === true) {
      this.PlanificacionComidasForm.patchValue({
        extraForm: 'true'
      })
    }
    else {
      this.PlanificacionComidasForm.patchValue({
        extraForm: 'false'
      })
    }
  }

  estilo: any;
  habilitarServicio: boolean = false;
  IngresarServicio(form) {
    if (form.tipoForm === undefined) {
      this.PlanificacionComidasForm.patchValue({
        servicioForm: '',
      });
      this.estilo = { 'visibility': 'visible' }; this.habilitarServicio = true;
      this.toastr.info('Ingresar nombre del nuevo tipo de servicio.', 'Etiqueta Ingresar Servicio activa', {
        timeOut: 6000,
      })
      this.habilitarSeleccion = false;
    }
  }

  habilitarSeleccion: boolean = true;
  VerTiposServicios() {
    this.PlanificacionComidasForm.patchValue({
      servicioForm: '',
    });
    this.estilo = { 'visibility': 'hidden' }; this.habilitarServicio = false;
    this.habilitarSeleccion = true;
  }

  servicios: any = [];
  ObtenerServicios() {
    this.servicios = [];
    this.restPlan.ObtenerTipoComidas().subscribe(datos => {
      this.servicios = datos;
      this.servicios[this.servicios.length] = { nombre: "OTRO" };
    })
  }

  contador: number = 0;
  RegistrarServicio(form, datos: any) {
    if (form.servicioForm != '') {
      let tipo_servicio = {
        nombre: form.servicioForm
      }
      this.restPlan.CrearTipoComidas(tipo_servicio).subscribe(res => {
        // Buscar id de último cargo ingresado
        this.restPlan.ObtenerUltimoTipoComidas().subscribe(data => {
          // Buscar id de último cargo ingresado
          datos.tipo_comida = data[0].max;
          this.restPlan.ActualizarDatos(datos).subscribe(res => {
            this.toastr.success('Operación Exitosa', 'Planificación de Alimentación Registrada', {
              timeOut: 6000,
            })
            this.CerrarRegistroPlanificacion();
          });
        });
      });
    }
    else {
      this.toastr.info('Ingresar el tipo de servicio', 'Verificar datos', {
        timeOut: 6000,
      });
    }
  }

}
