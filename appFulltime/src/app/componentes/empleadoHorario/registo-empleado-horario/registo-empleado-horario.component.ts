import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { PlanGeneralService } from 'src/app/servicios/planGeneral/plan-general.service';


@Component({
  selector: 'app-registo-empleado-horario',
  templateUrl: './registo-empleado-horario.component.html',
  styleUrls: ['./registo-empleado-horario.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class RegistoEmpleadoHorarioComponent implements OnInit {

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
    public restE: EmpleadoService,
    public restD: DetalleCatHorariosService,
    public restP: PlanGeneralService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistoEmpleadoHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) {
    this.dataItem = 4;
  }

  ngOnInit(): void {
    this.BuscarHorarios();
    this.ObtenerEmpleado(this.datoEmpleado.idEmpleado);
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
    let datosBusqueda = {
      id_cargo: this.datoEmpleado.idCargo,
      id_empleado: this.datoEmpleado.idEmpleado
    }
    this.restE.BuscarFechaContrato(datosBusqueda).subscribe(response => {
      console.log('fecha', response[0].fec_ingreso.split('T')[0], ' ', Date.parse(form.fechaInicioForm), Date.parse(response[0].fec_ingreso.split('T')[0]))
      if (Date.parse(response[0].fec_ingreso.split('T')[0]) < Date.parse(form.fechaInicioForm)) {
        if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinalForm)) {
          this.InsertarEmpleadoHorario(form);
        }
        else {
          this.toastr.info('La fecha de inicio de actividades debe ser mayor a la fecha de fin de actividades.','', {
            timeOut: 6000,
          });
        }
      }
      else {
        this.toastr.info('La fecha de inicio de actividades no puede ser anterior a la fecha de ingreso de contrato.','', {
          timeOut: 6000,
        });
      }
    }, error => {
    });
  }

  fechasHorario: any = [];
  inicioDate: any;
  finDate: any;
  InsertarEmpleadoHorario(form) {
    let fechas = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinalForm,
    };
    this.rest.VerificarDuplicidadHorarios(this.datoEmpleado.idEmpleado, fechas).subscribe(response => {
      this.toastr.info('Las fechas ingresadas ya se encuentran registradas en otro horario','', {
        timeOut: 6000,
      });
    }, error => {
      let datosempleH = {
        id_empl_cargo: this.datoEmpleado.idCargo,
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
        estado: form.estadoForm
      };
      console.log(datosempleH);
      this.rest.IngresarEmpleadoHorarios(datosempleH).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horario del Empleado registrado', {
          timeOut: 6000,
        });
        this.IngresarPlanGeneral(form);
        this.CerrarVentanaEmpleadoHorario();
      });
    });
  }

  detalles: any = [];
  IngresarPlanGeneral(form) {
    this.detalles = [];
    this.restD.ConsultarUnDetalleHorario(form.horarioForm).subscribe(res => {
      this.detalles = res;
      //this.toastr.success('Operación Exitosa', 'Horario del Empleado registrado', {
      //  timeOut: 6000,
      //});
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
            id_empl_cargo: this.datoEmpleado.idCargo,
            tipo_entr_salida: element.tipo_accion,
            codigo: this.empleado[0].codigo
          };
          this.restP.CrearPlanGeneral(plan).subscribe(res => {
          })
        })
      })
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
    this.dialogRef.close(this.dataItem);
    //window.location.reload();
  }


}
