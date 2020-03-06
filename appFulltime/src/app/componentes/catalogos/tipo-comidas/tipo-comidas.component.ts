import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoComidasService } from 'src/app/servicios/catalogos/tipoComidas/tipo-comidas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipo-comidas',
  templateUrl: './tipo-comidas.component.html',
  styleUrls: ['./tipo-comidas.component.css']
})
export class TipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', Validators.required);
  valorF = new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]+)?$")]);
  observacionF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public TipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
    valorForm: this.valorF,
    observacionForm: this.observacionF
  });

  constructor(
    private rest: TipoComidasService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  InsertarTipoComida(form) {
    let datosTipoComida = {
      nombre: form.nombreForm,
      valor: form.valorForm,
      observacion: form.observacionForm
    };

    this.rest.CrearNuevoTipoComida(datosTipoComida).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Tipo de comida registrado')
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Tipo de comida no se pudo registrar')

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
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 44 || keynum == 46) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  ObtenerMensajeErrorCamposLetras() {
    if (this.nombreF.hasError('required')) {
      return 'Debe ingresar un nombre';
    }
  }

  ObtenerMensajeErrorCamposNumericos() {
    if (this.valorF.hasError('required')) {
      
      return 'Debe ingresar un valor';
    }
    return this.valorF.hasError('pattern') ? 'Ingresar valor con dos decimales' : '';
  }

  LimpiarCampos() {
    this.TipoComidaForm.reset();
  }

}
