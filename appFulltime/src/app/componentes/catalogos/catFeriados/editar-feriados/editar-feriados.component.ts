import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';

@Component({
  selector: 'app-editar-feriados',
  templateUrl: './editar-feriados.component.html',
  styleUrls: ['./editar-feriados.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class EditarFeriadosComponent implements OnInit {

  idFeriado: number;
  // Control de campos y validaciones del formulario
  fechaF = new FormControl('', Validators.required);
  descripcionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
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
    this.ImprimirDatos();
  }

  ActualizarFeriados(form) {
    let datosFeriado = {
      id: this.data.id,
      fecha: form.fechaForm,
      descripcion: form.descripcionForm,
      fec_recuperacion: form.fechaRecuperacionForm
    };
    if(datosFeriado.fec_recuperacion === ''){
      datosFeriado.fec_recuperacion = null;
    }
    this.rest.ActualizarUnFeriado(datosFeriado).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Feriado Actualizado')
      this.LimpiarCampos();
      this.dialogRef.close();
      this.router.navigate(['/verFeriados/', datosFeriado.id]);
    }, error => {
      this.toastr.error('Operación Fallida', 'Feriado no se pudo registrar')
    });
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.descripcionF.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.descripcionF.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

  LimpiarCampos() {
    this.EditarFeriadosForm.reset();
  }

  CerrarVentanaEditarFeriado() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

  ImprimirDatos() {
    this.EditarFeriadosForm.setValue({
      descripcionForm: this.data.descripcion,
      fechaForm: this.data.fecha,
      fechaRecuperacionForm: this.data.fec_recuperacion
    })
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }

}
