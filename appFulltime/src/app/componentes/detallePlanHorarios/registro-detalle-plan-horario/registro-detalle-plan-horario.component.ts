import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';


interface Dia {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-registro-detalle-plan-horario',
  templateUrl: './registro-detalle-plan-horario.component.html',
  styleUrls: ['./registro-detalle-plan-horario.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class RegistroDetallePlanHorarioComponent implements OnInit {

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
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<RegistroDetallePlanHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.BuscarHorarios();
  }

  BuscarHorarios() {
    this.horarios = [];
    this.restH.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
    })
  }

  InsertarDetallePlanHorario(form) {
    let datosDetallePlanH = {
      fecha: form.fechaForm,
      id_plan_horario: this.data.planHorario.id,
      tipo_dia: form.tipoDiaForm,
      id_cg_horarios: form.horarioForm,
    };
    this.rest.RegistrarDetallesPlanHorario(datosDetallePlanH).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Detalle de Planificación de Horario registrado')
      this.CerrarVentanaDetallePlanHorario();
    }, error => {
    });
  }

  LimpiarCampos() {
    this.DetallePlanHorarioForm.reset();
  }

  CerrarVentanaDetallePlanHorario() {
    this.LimpiarCampos();
    this.dialogRef.close();
    if (this.data.actualizarPage === false && this.data.direccionarE === false) {
      this.router.navigate(['/verDetalles/', this.data.planHorario.id, this.data.idEmpleado]);
    }
    if (this.data.actualizarPage === false && this.data.direccionarE === true) {
      this.router.navigate(['/detallesHEmpleado/', this.data.planHorario.id, this.data.idEmpleado]);
    }

  }

  Salir() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

}
