import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';

@Component({
  selector: 'app-registro-plan-horario',
  templateUrl: './registro-plan-horario.component.html',
  styleUrls: ['./registro-plan-horario.component.css']
})
export class RegistroPlanHorarioComponent implements OnInit {

  // Control de campos y validaciones del formulario
  fechaIngresoF = new FormControl('', [Validators.required]);
  fechaSalidaF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public PlanHorarioForm = new FormGroup({
    fechaIngresoForm: this.fechaIngresoF,
    fechaSalidaForm: this.fechaSalidaF,
  });

  constructor(
    public rest: PlanHorarioService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroPlanHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) { }

  ngOnInit(): void {
  }

  ValidarDatosPlanHorario(form) {
    if (Date.parse(form.fechaIngresoForm) < Date.parse(form.fechaSalidaForm)) {
      this.InsertarPlanHorario(form);
    }
    else {
      this.toastr.info('La fecha de salida debe ser mayor a la fecha de ingreso')
    }
  }

  InsertarPlanHorario(form) {
    let datosPlanHorario = {
      id_cargo: this.datoEmpleado.idCargo,
      fec_inicio: form.fechaIngresoForm,
      fec_final: form.fechaSalidaForm,
    };
    this.rest.RegistrarPlanHorario(datosPlanHorario).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Planificación de Horario registrado')
      this.CerrarVentanaPlanHorario();
    }, error => {
    });
  }

  LimpiarCampos() {
    this.PlanHorarioForm.reset();
  }

  CerrarVentanaPlanHorario() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
