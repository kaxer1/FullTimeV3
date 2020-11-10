import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { PlanGeneralService } from 'src/app/servicios/planGeneral/plan-general.service';


interface Dia {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-editar-detalle-plan',
  templateUrl: './editar-detalle-plan.component.html',
  styleUrls: ['./editar-detalle-plan.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class EditarDetallePlanComponent implements OnInit {

  horarios: any = [];

  dia: Dia[] = [
    { value: 1, viewValue: 'Libre' },
    { value: 2, viewValue: 'Feriado' },
    { value: 3, viewValue: 'Normal' }
  ];

  tipoDia = new FormControl('', Validators.required);
  fechaF = new FormControl('', [Validators.required]);
  horarioF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public DetallePlanHorarioForm = new FormGroup({
    fechaForm: this.fechaF,
    tipoDiaForm: this.tipoDia,
    horarioForm: this.horarioF
  });
  constructor(
    public rest: DetallePlanHorarioService,
    public restH: HorarioService,
    public restD: DetalleCatHorariosService,
    public restP: PlanGeneralService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<EditarDetallePlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.BuscarHorarios();
    this.CargarDatos();
  }

  BuscarHorarios() {
    this.horarios = [];
    this.restH.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
    })
  }

  ValidarRegistro(form) {
    var fin = this.data.plan.fec_final.split('T')[0];
    var inicio = this.data.plan.fec_inicio.split('T')[0];
    var ingreso = String(moment(form.fechaForm, "YYYY/MM/DD").format("YYYY-MM-DD"));
    if ((Date.parse(fin) >= Date.parse(ingreso)) &&
      (Date.parse(inicio) <= Date.parse(ingreso))) {
      this.InsertarDetallePlanHorario(form);
    }
    else {
      this.toastr.info('La fecha de inicio de actividades no se encuentra dentro de la planificación registrada.');
    }
  }

  InsertarDetallePlanHorario(form) {
    let datosDetallePlanH = {
      fecha: form.fechaForm,
      id_plan_horario: this.data.detalle.id_plan_horario,
      tipo_dia: form.tipoDiaForm,
      id_cg_horarios: form.horarioForm,
      id: this.data.detalle.id
    };
    console.log('ver fechas', this.data.detalle.fecha, ' ', form.fechaForm)
    if (this.data.detalle.fecha != form.fechaForm) {
      let datosBusqueda = {
        id_plan_horario: this.data.detalle.id_plan_horario,
        fecha: form.fechaForm
      }
      this.rest.VerificarDuplicidad(datosBusqueda).subscribe(response => {
        this.toastr.info('Se le recuerda que esta fecha ya se encuentra en la lista de detalles.')
      }, error => {
        this.ActualizarDetallePlan(datosDetallePlanH, form);
      });
    }
    else {
      this.ActualizarDetallePlan(datosDetallePlanH, form);
    }
  }

  ActualizarDetallePlan(datos, form) {
    this.rest.ActualizarRegistro(datos).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Detalle de Planificación de Horario actualizado');
      this.EliminarDatos(form);
      this.IngresarPlanGeneral(form);
      this.Salir();
    });
  }

  EliminarDatos(form) {
    console.log('codigo', this.data.plan.codigo, moment(form.fechaForm).format('YYYY-MM-DD'))
    let plan_fecha = {
      fec_horario: form.fechaForm.split('T')[0],
    };
    this.restP.EliminarRegistro(this.data.plan.codigo, plan_fecha).subscribe(res => {
      console.log('probando eliminar')
    })
  }

  detalles: any = [];
  IngresarPlanGeneral(form) {
    this.detalles = [];
    this.restD.ConsultarUnDetalleHorario(form.horarioForm).subscribe(res => {
      this.detalles = res;
      this.detalles.map(element => {
        var accion = 0;
        if (element.tipo_accion === 'E') {
          accion = element.minu_espera;
        }
        let plan = {
          fec_hora_horario: moment(form.fechaForm).format('YYYY-MM-DD') + ' ' + element.hora,
          maxi_min_espera: accion,
          estado: null,
          id_det_horario: element.id,
          fec_horario: form.fechaForm,
          id_empl_cargo: this.data.plan.id_cargo,
          tipo_entr_salida: element.tipo_accion,
          codigo: this.data.plan.codigo
        };
        this.restP.CrearPlanGeneral(plan).subscribe(res => {
        })
      })
    });
  }

  LimpiarCampos() {
    this.DetallePlanHorarioForm.reset();
  }

  Salir() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  CargarDatos() {
    this.DetallePlanHorarioForm.patchValue({
      fechaForm: this.data.detalle.fecha,
      tipoDiaForm: this.data.detalle.tipo_dia,
      horarioForm: this.data.detalle.id_horario
    })
  }

}
