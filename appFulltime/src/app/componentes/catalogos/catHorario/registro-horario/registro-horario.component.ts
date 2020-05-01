import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';

@Component({
  selector: 'app-registro-horario',
  templateUrl: './registro-horario.component.html',
  styleUrls: ['./registro-horario.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class RegistroHorarioComponent implements OnInit {

  // Validaciones para el formulario
  nombre = new FormControl('', [Validators.required, Validators.minLength(3)]);
  minAlmuerzo = new FormControl('', [Validators.pattern('[0-9]*')]);
  horaTrabajo = new FormControl('', [Validators.required, Validators.pattern("^[0-9](.[0-9])?$")]);
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
    public dialogRef: MatDialogRef<RegistroHorarioComponent>,

  ) { }

  ngOnInit(): void {
  }

  InsertarHorario(form) {
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
    this.rest.postHorarioRest(dataHorario).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Horario registrado');
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Horario no pudo ser registrado')
    });;
  }

  IngresarNumeroDecimal(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 46) {
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
      return 'Valor debe ser menor a 10 hasta con un decimal';
    }
  }

  LimpiarCampos() {
    this.nuevoHorarioForm.reset();
  }

  CerrarVentanaRegistroHorario() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
