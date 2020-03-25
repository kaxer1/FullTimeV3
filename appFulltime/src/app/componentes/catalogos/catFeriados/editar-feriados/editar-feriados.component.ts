import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';

@Component({
  selector: 'app-editar-feriados',
  templateUrl: './editar-feriados.component.html',
  styleUrls: ['./editar-feriados.component.css']
})
export class EditarFeriadosComponent implements OnInit {

  idFeriado: number;
  // Control de campos y validaciones del formulario
  fechaF = new FormControl('', Validators.required);
  descripcionF = new FormControl('', [Validators.required]);
  fechaRecuperacionF = new FormControl('');


  // Asignación de validaciones a inputs del formulario
  public EditarFeriadosForm = new FormGroup({
    fechaForm: this.fechaF,
    descripcionForm: this.descripcionF,
    fechaRecuperacionForm: this.fechaRecuperacionF
  });

  constructor(
    private rest: FeriadosService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<EditarFeriadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.imprimirdatos();
  }

  ActualizarFeriados(form) {
    this.imprimirdatos();
    let datosFeriado = {
      fecha: form.fechaForm,
      descripcion: form.descripcionForm,
      fec_recuperacion: form.fechaRecuperacionForm
    };
    this.rest.ActualizarUnFeriado(this.idFeriado, datosFeriado).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Feriado Actualizado')
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
    this.EditarFeriadosForm.reset();
  }

  CerrarVentanaEditarFeriado() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  imprimirdatos() {
    console.log('hola', this.data.idFeriado)
  }

}
