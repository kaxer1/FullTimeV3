import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PlanGeneralService } from 'src/app/servicios/planGeneral/plan-general.service';

@Component({
  selector: 'app-editar-horario-empleado',
  templateUrl: './editar-horario-empleado.component.html',
  styleUrls: ['./editar-horario-empleado.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class EditarHorarioEmpleadoComponent implements OnInit {

  dataItem: any;

  lunes = false;
  martes = false;
  miercoles = false;
  jueves = false;
  viernes = false;
  sabado = false;
  domingo = false;
  horarios: any = [];

  horarioF = new FormControl('', [Validators.required]);
  fechaInicioF = new FormControl('', Validators.required);
  fechaFinalF = new FormControl('', [Validators.required]);
  estadoF = new FormControl('', [Validators.required]);
  lunesF = new FormControl('');
  martesF = new FormControl('');
  miercolesF = new FormControl('');
  juevesF = new FormControl('');
  viernesF = new FormControl('');
  sabadoF = new FormControl('');
  domingoF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public EmpleadoHorarioForm = new FormGroup({
    horarioForm: this.horarioF,
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    estadoForm: this.estadoF,
    lunesForm: this.lunesF,
    martesForm: this.martesF,
    miercolesForm: this.miercolesF,
    juevesForm: this.juevesF,
    viernesForm: this.viernesF,
    sabadoForm: this.sabadoF,
    domingoForm: this.domingoF
  });

  constructor(
    public rest: EmpleadoHorariosService,
    public restH: HorarioService,
    public restD: DetalleCatHorariosService,
    public restE: EmpleadoService,
    public restP: PlanGeneralService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarHorarioEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataItem = 4;
  }

  ngOnInit(): void {
    console.log('datos', this.data)
    this.BuscarHorarios();
    this.CargarDatos();
    this.ObtenerEmpleado(this.data.idEmpleado);
  }

  BuscarHorarios() {
    this.horarios = [];
    this.restH.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
    })
  }

  empleado: any = [];
  // Método para ver la información del empleado 
  ObtenerEmpleado(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  ValidarFechas(form) {
    if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinalForm)) {
      this.InsertarEmpleadoHorario(form);
    }
    else {
      this.toastr.info('La fecha de inicio de actividades debe ser mayor a la fecha de fin de actividades', '', {
        timeOut: 6000,
      })
    }
  }

  InsertarEmpleadoHorario(form) {
    let fechas = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinalForm,
      id_horario: form.horarioForm
    };
    this.rest.VerificarDuplicidadHorariosEdicion(this.data.datosHorario.id, this.data.datosHorario.codigo, fechas).subscribe(response => {
      this.toastr.info('Las fechas ingresadas ya se encuntran registradas en otro horario.', '', {
        timeOut: 6000,
      });
    }, error => {
      let datosempleH = {
        id_empl_cargo: this.data.datosHorario.id_empl_cargo,
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
        id: this.data.datosHorario.id
      };
      console.log(datosempleH);
      this.rest.ActualizarDatos(datosempleH).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horario del Empleado actualizado', {
          timeOut: 6000,
        });
        this.EliminarPlanificacion();
        this.IngresarPlanGeneral(form);
        this.CerrarVentanaEmpleadoHorario();
      }, error => { });
    });
  }

  id_planificacion_general: any = [];
  EliminarPlanificacion() {
    this.id_planificacion_general = [];
    let plan_fecha = {
      fec_inicio: this.data.datosHorario.fec_inicio.split('T')[0],
      fec_final: this.data.datosHorario.fec_final.split('T')[0],
      id_horario: this.data.datosHorario.id_horarios,
      codigo: parseInt(this.empleado[0].codigo)
    };
    this.restP.BuscarFechas(plan_fecha).subscribe(res => {
      this.id_planificacion_general = res;
      this.id_planificacion_general.map(obj => {
        this.restP.EliminarRegistro(obj.id).subscribe(res => {
        })
      })
    })
  }

  detalles: any = [];
  inicioDate: any;
  finDate: any;
  fechasHorario: any = [];
  IngresarPlanGeneral(form) {
    this.detalles = [];
    this.restD.ConsultarUnDetalleHorario(form.horarioForm).subscribe(res => {
      this.detalles = res;
      this.fechasHorario = []; // Array que contiene todas las fechas del mes indicado 
      this.inicioDate = moment(form.fechaInicioForm).format('MM-DD-YYYY');
      this.finDate = moment(form.fechaFinalForm).format('MM-DD-YYYY');

      // Inicializar datos de fecha
      var start = new Date(this.inicioDate);
      var end = new Date(this.finDate);

      // Lógica para obtener el nombre de cada uno de los día del periodo indicado
      while (start <= end) {
        /* console.log(moment(start).format('dddd DD/MM/YYYY'), form.lunesForm)
         if (moment(start).format('dddd') === 'lunes' && form.lunesForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }
         if (moment(start).format('dddd') === 'martes' && form.martesForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }
         if (moment(start).format('dddd') === 'miércoles' && form.miercolesForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }
         if (moment(start).format('dddd') === 'jueves' && form.juevesForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }
         if (moment(start).format('dddd') === 'viernes' && form.viernesForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }
         if (moment(start).format('dddd') === 'sábado' && form.sabadoForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }
         if (moment(start).format('dddd') === 'domingo' && form.domingoForm === false) {
           this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
         }*/
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
            fec_hora_horario: obj + ' ' + element.hora,
            maxi_min_espera: accion,
            estado: null,
            id_det_horario: element.id,
            fec_horario: obj,
            id_empl_cargo: this.data.datosHorario.id_empl_cargo,
            tipo_entr_salida: element.tipo_accion,
            codigo: this.empleado[0].codigo,
            id_horario: form.horarioForm
          };
          this.restP.CrearPlanGeneral(plan).subscribe(res => {
          })
        })
      })
    });
  }

  LimpiarCampos() {
    this.EmpleadoHorarioForm.reset();
  }

  CerrarVentanaEmpleadoHorario() {
    this.LimpiarCampos();
    this.dialogRef.close(this.dataItem);
  }

  CargarDatos() {
    this.EmpleadoHorarioForm.patchValue({
      horarioForm: this.data.datosHorario.id_horarios,
      fechaInicioForm: this.data.datosHorario.fec_inicio,
      fechaFinalForm: this.data.datosHorario.fec_final,
      estadoForm: String(this.data.datosHorario.estado),
      lunesForm: this.data.datosHorario.lunes,
      martesForm: this.data.datosHorario.martes,
      miercolesForm: this.data.datosHorario.miercoles,
      juevesForm: this.data.datosHorario.jueves,
      viernesForm: this.data.datosHorario.viernes,
      sabadoForm: this.data.datosHorario.sabado,
      domingoForm: this.data.datosHorario.domingo
    })
    this.lunes = this.data.datosHorario.lunes;
    this.martes = this.data.datosHorario.martes;
    this.miercoles = this.data.datosHorario.miercoles;
    this.jueves = this.data.datosHorario.jueves;
    this.viernes = this.data.datosHorario.viernes;
    this.sabado = this.data.datosHorario.sabado;
    this.domingo = this.data.datosHorario.domingo;
  }

  VerificarDetalles(form) {
    this.restD.ConsultarUnDetalleHorario(form.horarioForm).subscribe(res => {
    },
      erro => {
        this.EmpleadoHorarioForm.patchValue({
          horarioForm: ''
        });
        this.toastr.info('El horario seleccionado no tienen registros de detalle de horario.', 'Primero registrar detalle de horario.', {
          timeOut: 6000,
        });
      })
  }


}
