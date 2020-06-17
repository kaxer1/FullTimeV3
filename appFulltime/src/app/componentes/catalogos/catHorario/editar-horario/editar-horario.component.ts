import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { PrincipalHorarioComponent } from '../principal-horario/principal-horario.component';


@Component({
  selector: 'app-editar-horario',
  templateUrl: './editar-horario.component.html',
  styleUrls: ['./editar-horario.component.css']
})
export class EditarHorarioComponent implements OnInit {

  // Validaciones para el formulario
  nombre = new FormControl('', [Validators.required, Validators.minLength(2)]);
  minAlmuerzo = new FormControl('', [Validators.pattern('[0-9]*')]);
  horaTrabajo = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(:[0-9][0-9])?$")]);
  flexible = new FormControl('', Validators.required);
  porHoras = new FormControl('', Validators.required);

  // asignar los campos en un formulario en grupo
  public nuevoHorarioForm = new FormGroup({
    horarioNombreForm: this.nombre,
    horarioMinAlmuerzoForm: this.minAlmuerzo,
    horarioHoraTrabajoForm: this.horaTrabajo,
    horarioFlexibleForm: this.flexible,
    horarioPorHorasForm: this.porHoras
  });
  
  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public horario: any
  ) { }

  ngOnInit(): void {
    this.nuevoHorarioForm.patchValue({
      horarioNombreForm: this.horario.nombre,
      horarioMinAlmuerzoForm: this.horario.min_almuerzo,
      horarioHoraTrabajoForm: this.horario.hora_trabajo,
      horarioFlexibleForm: this.horario.flexible,
      horarioPorHorasForm: this.horario.por_horas
    })
  }

  ModificarHorario(form) {
    let dataHorario = {
      nombre: form.horarioNombreForm,
      min_almuerzo: form.horarioMinAlmuerzoForm,
      hora_trabajo: form.horarioHoraTrabajoForm,
      flexible: form.horarioFlexibleForm,
      por_horas: form.horarioPorHorasForm
    };
    if (dataHorario.min_almuerzo === ''){
      dataHorario.min_almuerzo = 0;
    }
    
    this.rest.putHorarioRest(this.horario.id, dataHorario).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Horario registrado');
      this.LimpiarCampos();
      this.dialogRef.close();
      window.location.reload();
    }, error => {
      this.toastr.error('Operación Fallida', 'Horario no pudo ser registrado')
    });
  }

  IngresarNumeroDecimal(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 58) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  IngresarSoloNumerosEnteros(evt) {
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo obligatorio';
    }
  }

  ObtenerMensajeErrorHoraTrabajo() {
    if (this.horaTrabajo.hasError('pattern')) {
      return 'Indicar horas y minutos. Ejemplo: 12:05';
    }
  }

  LimpiarCampos() {
    this.nuevoHorarioForm.reset();
  }

  CerrarVentanaEditarHorario() {
    this.dialogRef.close();
  }

}
