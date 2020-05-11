import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';

@Component({
  selector: 'app-editar-tipo-comidas',
  templateUrl: './editar-tipo-comidas.component.html',
  styleUrls: ['./editar-tipo-comidas.component.css']
})
export class EditarTipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  valorF = new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(.[0-9][0-9])?$")]);
  observacionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{5,48}")]);

  // Asignación de validaciones a inputs del formulario
  public TipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
    valorForm: this.valorF,
    observacionForm: this.observacionF
  });

  constructor(
    private rest: TipoComidasService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarTipoComidasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.ImprimirDatos();
  }

  InsertarTipoComida(form) {
    let datosTipoComida = {
      id: this.data.id,
      nombre: form.nombreForm,
      valor: form.valorForm,
      observacion: form.observacionForm
    };
    this.rest.ActualizarUnAlmuerzo(datosTipoComida).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Tipo de comida actualizado')
      this.CerrarVentanaRegistroTipoComidas();
    }, error => {
      this.toastr.error('Operación Fallida', 'Tipo de comida no se pudo registrar')
    });
  }

  ImprimirDatos() {
    this.TipoComidaForm.setValue({
      nombreForm: this.data.nombre,
      valorForm: this.data.valor,
      observacionForm: this.data.observacion
    })
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

  ObtenerMensajeErrorNombreRequerido() {
    if (this.nombreF.hasError('required')) {
      return 'Campo obligatorio';
    }
  }

  ObtenerMensajeErrorCamposNumericosRequeridos() {
    if (this.valorF.hasError('required')) {
      return 'Ingresar un valor hasta con dos decimales';
    }
    return this.valorF.hasError('pattern') ? 'Ingresar dos decimales' : '';
  }

  ObtenerMensajeErrorObservacion() {
    if (this.observacionF.hasError('pattern')) {
      return 'Ingresar una observación válida';
    }
  }

  LimpiarCampos() {
    this.TipoComidaForm.reset();
  }

  CerrarVentanaRegistroTipoComidas() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}