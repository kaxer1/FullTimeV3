import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegimenService } from 'src/app/servicios/catalogos/regimen/regimen.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-regimen',
  templateUrl: './regimen.component.html',
  styleUrls: ['./regimen.component.css']
})
export class RegimenComponent implements OnInit {

  // Control de campos y validaciones del formulario
  descripcionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  diaAnioVacacionF = new FormControl('');
  diaIncrAntiguedadF = new FormControl('');
  anioAntiguedadF = new FormControl('');
  diaMesVacacionF = new FormControl('', [Validators.required, Validators.pattern('[0-9]')]);
  maxDiasAcumulacionF = new FormControl('');
  diaLibreAnioVacaccionF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public RegimenForm = new FormGroup({
    descripcionForm: this.descripcionF,
    diaAnioVacacionForm: this.diaAnioVacacionF,
    diaIncrAntiguedadForm: this.diaIncrAntiguedadF,
    anioAntiguedadForm: this.anioAntiguedadF,
    diaMesVacacionForm: this.diaMesVacacionF,
    maxDiasAcumulacionForm: this.maxDiasAcumulacionF,
    diaLibreAnioVacaccionForm: this.diaLibreAnioVacaccionF
  });

  constructor(
    private rest: RegimenService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  InsertarRegimen(form) {
    let datosRegimen = {
      descripcion: form.descripcionForm,
      dia_anio_vacacion: form.diaAnioVacacionForm,
      dia_incr_antiguedad: form.diaIncrAntiguedadForm,
      anio_antiguedad: form.anioAntiguedadForm,
      dia_mes_vacacion: form.diaMesVacacionForm,
      max_dia_acumulacion: form.maxDiasAcumulacionForm,
      dia_libr_anio_vacacion: form.diaLibreAnioVacaccionForm
    };

    // Igualar a cero los valores que no son requeridos en el formulario
    if (datosRegimen.dia_anio_vacacion === '') {
      datosRegimen.dia_anio_vacacion = 0;
    };
    if (datosRegimen.dia_incr_antiguedad === '') {
      datosRegimen.dia_incr_antiguedad = 0;
    };
    if (datosRegimen.anio_antiguedad === '') {
      datosRegimen.anio_antiguedad = 0;
    };
    if (datosRegimen.max_dia_acumulacion === '') {
      datosRegimen.max_dia_acumulacion = 0;
    };
    this.rest.CrearNuevoRegimen(datosRegimen).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Régimen Laboral guardado')
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Régimen Laboral no se guardó')

    });
  }

  IngresarSoloNumeros(evt) {
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

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6];
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

  ObtenerMensajeErrorCamposLetras() {
    if (this.descripcionF.hasError('required')) {
      return 'Debe ingresar un nombre';
    }
  }

  ObtenerMensajeErrorCamposNumericos() {
    if (this.diaMesVacacionF.hasError('required') || this.diaLibreAnioVacaccionF.hasError('required')) {
      return 'Debe ingresar un valor';
    }
  }

  LimpiarCampos() {
    this.RegimenForm.setValue({
      descripcionForm: '',
      diaAnioVacacionForm: '',
      diaIncrAntiguedadForm: '',
      anioAntiguedadForm: '',
      diaMesVacacionForm: '',
      maxDiasAcumulacionForm: '',
      diaLibreAnioVacaccionForm: ''
    });
  }

}
