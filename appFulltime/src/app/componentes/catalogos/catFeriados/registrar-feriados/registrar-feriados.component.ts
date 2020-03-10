import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FeriadosService } from 'src/app/servicios/catalogos/feriados/feriados.service';

@Component({
  selector: 'app-registrar-feriados',
  templateUrl: './registrar-feriados.component.html',
  styleUrls: ['./registrar-feriados.component.css']
})

export class RegistrarFeriadosComponent implements OnInit {

  // Control de campos y validaciones del formulario
  fechaF = new FormControl('', Validators.required);
  descripcionF = new FormControl('', [Validators.required]);
  fechaRecuperacionF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public FeriadosForm = new FormGroup({
    fechaForm: this.fechaF,
    descripcionForm: this.descripcionF,
    fechaRecuperacionForm: this.fechaRecuperacionF
  });

  constructor(
    private rest: FeriadosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarFeriadosComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  InsertarFeriado(form) {
    let datosFeriado = {
      fecha: form.fechaForm,
      descripcion: form.descripcionForm,
      fec_recuperacion: form.fechaRecuperacionForm
    };
    this.rest.CrearNuevoFeriado(datosFeriado).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Feriado registrado')
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Feriado no se pudo registrar')
    });
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.descripcionF.hasError('required')) {
      return 'Debe ingresar un nombre';
    }
  }

  ObtenerMensajeErrorFechaRequerida() {
    if (this.fechaF.hasError('required')) {
      return 'Debe ingresar una fecha';
    }
  }

  LimpiarCampos() {
    this.FeriadosForm.reset();
  }

  CerrarVentanaRegistroFeriado() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
