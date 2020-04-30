import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';


interface Dia {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-registro-detalle-plan-horario',
  templateUrl: './registro-detalle-plan-horario.component.html',
  styleUrls: ['./registro-detalle-plan-horario.component.css']
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
    public dialogRef: MatDialogRef<RegistroDetallePlanHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
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
    let datosDetallePlanH= {
      fecha: form.fechaForm,
      id_plan_horario: this.datoEmpleado.idPlanHorario,
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
    window.location.reload();
  }

}
