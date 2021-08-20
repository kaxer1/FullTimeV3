// IMPORTAR LIBRERIAS
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

// IMPORTAR SERVICIOS
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { PlanGeneralService } from 'src/app/servicios/planGeneral/plan-general.service';

@Component({
  selector: 'app-horarios-multiples',
  templateUrl: './horarios-multiples.component.html',
  styleUrls: ['./horarios-multiples.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ]
})

export class HorariosMultiplesComponent implements OnInit {

  // OPCIONES DE DÍAS LIBRERIAS EN HORARIOS
  miercoles = false;
  domingo = false;
  viernes = false;
  martes = false;
  jueves = false;
  sabado = false;
  lunes = false;

  horarios: any = []; // VARIABLE DE ALMACENAMIENTO DE HORARIOS

  fechaInicioF = new FormControl('', Validators.required);
  fechaFinalF = new FormControl('', Validators.required);
  horarioF = new FormControl('', Validators.required);
  estadoF = new FormControl('', Validators.required);
  miercolesF = new FormControl('');
  viernesF = new FormControl('');
  domingoF = new FormControl('');
  martesF = new FormControl('');
  juevesF = new FormControl('');
  sabadoF = new FormControl('');
  lunesF = new FormControl('');

  // ASIGNACIÓN DE VALIDACIONES A INPUTS DEL FORMULARIO
  public EmpleadoHorarioForm = new FormGroup({
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    miercolesForm: this.miercolesF,
    horarioForm: this.horarioF,
    viernesForm: this.viernesF,
    domingoForm: this.domingoF,
    estadoForm: this.estadoF,
    martesForm: this.martesF,
    juevesForm: this.juevesF,
    sabadoForm: this.sabadoF,
    lunesForm: this.lunesF,
  });

  constructor(
    public restH: HorarioService, // SERVCIOS DE HORARIOS
    public restE: EmpleadoService, // SERVICIOS DE DATOS DE EMPLEADOS
    private toastr: ToastrService, // VARIABLE USADA PARA MOSTRAR NOTIFICACIONES
    public restP: PlanGeneralService, // SERVICIO DE DATOS DE PLANIFICACIÓN DE HORARIOS
    public rest: EmpleadoHorariosService, // SERVICIO DE DATOS DE HORARIOS ASIGNADOS A UN EMPLEADO
    public restD: DetalleCatHorariosService, // SERVICIO DE DATOS DE DETALLES DE HORARIOS
    @Inject(MAT_DIALOG_DATA) public data: any, // IMPORTACIÓN DE DATOS DE COMPONENTE HORARIOS-MULTIPLE-EMPLEADO
    public ventana: MatDialogRef<HorariosMultiplesComponent>, // VARIABLE USADA PARA ABRIR VENTANAS EXTERNAS
  ) { }

  ngOnInit(): void {
    console.log('varios', this.data.datos)
    this.BuscarHorarios();
    this.ObtenerEmpleado(this.data.datos.idEmpleado);
  }

  // VARIABLES DE ALMACENAMIENTO DE DATOS ESPECIFICOS DE UN HORARIO
  detalles_horarios: any = [];
  vista_horarios: any = [];
  hora_entrada: any;
  hora_salida: any;

  // MÉTODO PARA MOSTRAR NOMBRE DE HORARIO CON DETALLE DE ENTRADA Y SALIDA
  BuscarHorarios() {
    this.horarios = [];
    this.vista_horarios = [];
    // BÚSQUEDA DE HORARIOS
    this.restH.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
      this.horarios.map(hor => {
        // BÚSQUEDA DE DETALLES DE ACUERDO AL ID DE HORARIO
        this.restD.ConsultarUnDetalleHorario(hor.id).subscribe(res => {
          this.detalles_horarios = res;
          this.detalles_horarios.map(det => {
            if (det.tipo_accion === 'E') {
              this.hora_entrada = det.hora.slice(0, 5)
            }
            if (det.tipo_accion === 'S') {
              this.hora_salida = det.hora.slice(0, 5)
            }
          })
          let datos_horario = [{
            id: hor.id,
            nombre: '(' + this.hora_entrada + '-' + this.hora_salida + ') ' + hor.nombre
          }]
          if (this.vista_horarios.length === 0) {
            this.vista_horarios = datos_horario;
          } else {
            this.vista_horarios = this.vista_horarios.concat(datos_horario);
          }
        }, error => {
          let datos_horario = [{
            id: hor.id,
            nombre: hor.nombre
          }]
          if (this.vista_horarios.length === 0) {
            this.vista_horarios = datos_horario;
          } else {
            this.vista_horarios = this.vista_horarios.concat(datos_horario);
          }
        })
      })
    })
  }

  // MÉTODO PARA VER LA INFORMACIÓN DEL EMPLEADO
  empleado: any = [];
  ObtenerEmpleado(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  // MÉTODO PARA VERIFICAR QUE CAMPOS DE FECHAS NO SE ENCUENTREN VACIOS
  VerificarIngresoFechas(form) {
    if (form.fechaInicioForm === '' || form.fechaInicioForm === null || form.fechaInicioForm === undefined ||
      form.fechaFinalForm === '' || form.fechaFinalForm === null || form.fechaFinalForm === undefined) {
      this.toastr.warning('Por favor ingrese fechas de inicio y fin de actividades.', '', {
        timeOut: 6000,
      });
      this.EmpleadoHorarioForm.patchValue({
        horarioForm: 0
      })
    }
    else {
      this.ValidarFechas(form);
    }
  }

  // MÉTODO PARA VERIFICAR SI EL EMPLEADO INGRESO CORRECTAMENTE LAS FECHAS
  ValidarFechas(form) {
    if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinalForm)) {
      // this.InsertarEmpleadoHorario(form);
    }
    else {
      this.toastr.warning('Fecha de inicio de actividades debe ser mayor a la fecha fin de actividades.', '', {
        timeOut: 6000,
      });
      this.EmpleadoHorarioForm.patchValue({
        horarioForm: 0
      })
    }
  }

  // MÉTODO PARA LIMPIAR CAMPO SELECCIÓN DE HORARIO
  LimpiarHorario() {
    this.EmpleadoHorarioForm.patchValue({ horarioForm: 0 });
  }

  fechasHorario: any = [];
  inicioDate: any;
  finDate: any;
  contador: number = 0;
  InsertarEmpleadoHorario(form) {
    let fechas = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinalForm,
      id_horario: form.horarioForm
    };
    /*   this.rest.VerificarDuplicidadHorarios(this.data.datos.idEmpleado, fechas).subscribe(response => {
         this.toastr.info('Las fechas ingresadas ya se encuentran registradas en otro horario', '', {
           timeOut: 6000,
         });
       }, error => {*/
    this.contador = 0;
    this.data.datos.map(obj => {
      let datosempleH = {
        id_empl_cargo: obj.id_cargo,
        id_hora: 0,
        fec_inicio: form.fechaInicioForm,
        fec_final: form.fechaFinalForm,
        lunes: form.lunesForm,
        martes: form.martesForm,
        miercoles: form.miercolesForm,
        jueves: form.juevesForm,
        viernes: form.viernesForm,
        sabado: form.sabadoForm,
        domingo: form.domingoForm,
        id_horarios: form.horarioForm,
        estado: form.estadoForm,
        codigo: obj.codigo
      };
      console.log(datosempleH);
      this.rest.IngresarEmpleadoHorarios(datosempleH).subscribe(response => {

        //this.IngresarPlanGeneral(form);
        //this.CerrarVentanaEmpleadoHorario();
        this.contador = this.contador + 1;
        if (this.contador === this.data.datos.length) {
          this.ventana.close();
          window.location.reload();
          this.toastr.success('Operación Exitosa', 'Se registra un total de  ' + this.data.datos.length + ' Registros de horarios.', {
            timeOut: 6000,
          })
        }
      });
    })
    // });
  }

  detalles: any = [];
  IngresarPlanGeneral(form) {
    this.detalles = [];
    this.restD.ConsultarUnDetalleHorario(form.horarioForm).subscribe(res => {
      this.detalles = res;

      this.fechasHorario = []; // ARRAY QUE CONTIENE TODAS LAS FECHAS DEL MES INDICADO 
      this.inicioDate = moment(form.fechaInicioForm).format('MM-DD-YYYY');
      this.finDate = moment(form.fechaFinalForm).format('MM-DD-YYYY');

      // INICIALIZAR DATOS DE FECHA
      var start = new Date(this.inicioDate);
      var end = new Date(this.finDate);

      // LÓGICA PARA OBTENER EL NOMBRE DE CADA UNO DE LOS DÍA DEL PERIODO INDICADO
      while (start <= end) {
        this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
      }
      this.fechasHorario.map(obj => {
        this.detalles.map(element => {
          var accion = 0;
          if (element.tipo_accion === 'E') {
            accion = element.minu_espera;
          }
          let plan = {
            estado: null,
            fec_horario: obj,
            maxi_min_espera: accion,
            id_det_horario: element.id,
            id_horario: form.horarioForm,
            codigo: this.empleado[0].codigo,
            tipo_entr_salida: element.tipo_accion,
            id_empl_cargo: this.data.datos.idCargo,
            fec_hora_horario: obj + ' ' + element.hora,
          };
          this.restP.CrearPlanGeneral(plan).subscribe(res => {
          })

        })
      })
      this.toastr.success('Operación Exitosa', 'Horario del Empleado registrado', {
        timeOut: 6000,
      });
    });
  }

  LimpiarCampos() {
    this.EmpleadoHorarioForm.reset();
    this.EmpleadoHorarioForm.patchValue({
      lunesForm: false,
      martesForm: false,
      miercolesForm: false,
      juevesForm: false,
      viernesForm: false,
      sabadoForm: false,
      domingoForm: false
    });
  }

  CerrarVentanaEmpleadoHorario() {
    this.LimpiarCampos();
    this.ventana.close(this.data.datosItem);
  }


}
