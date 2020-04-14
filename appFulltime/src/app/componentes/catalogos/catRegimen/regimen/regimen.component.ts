import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';

interface opcionesRegimen {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-regimen',
  templateUrl: './regimen.component.html',
  styleUrls: ['./regimen.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RegimenComponent implements OnInit {

  // Control de campos y validaciones del formulario
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);
  diaAnioVacacionF = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);
  diaIncrAntiguedadF = new FormControl('', [Validators.required]);
  anioAntiguedadF = new FormControl('', [Validators.required]);
  diaMesVacacionF = new FormControl('', [Validators.required]);
  maxDiasAcumulacionF = new FormControl('', [Validators.required]);
  diaLibreAnioVacacionF = new FormControl('');
  regimenF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public RegimenForm = new FormGroup({
    diaMesVacacionForm: this.diaMesVacacionF,
    descripcionForm: this.descripcionF,
    diaAnioVacacionForm: this.diaAnioVacacionF,
    diaIncrAntiguedadForm: this.diaIncrAntiguedadF,
    anioAntiguedadForm: this.anioAntiguedadF,
    maxDiasAcumulacionForm: this.maxDiasAcumulacionF,
    diaLibreAnioVacacionForm: this.diaLibreAnioVacacionF,
    regimenForm: this.regimenF
  });

  // Arreglo de opcionesRegimen existentes
  regimen: opcionesRegimen[] = [
    { valor: 'Seleccionar', nombre: 'Seleccionar' },
    { valor: 'CODIGO DE TRABAJO', nombre: 'CODIGO DE TRABAJO' },
    { valor: 'LOSEP', nombre: 'LOSEP' },
    { valor: 'LOES', nombre: 'LOES' },
    { valor: 'OTRO', nombre: 'OTRO' },
  ];
  seleccionarRegimen: string = this.regimen[0].valor;

  constructor(
    private rest: RegimenService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegimenComponent>,
  ) { }

  ngOnInit(): void {
  }

  ActivarDescativarNombre(form) {
    var nombreRegimen = form.regimenForm;
    if (nombreRegimen === 'OTRO') {
      this.LimpiarDiasMeses();
      this.IngresarDatosOtro();
      (<HTMLInputElement>document.getElementById('nombreR')).style.visibility = 'visible';
      this.toastr.info('Ingresar nombre del nuevo Régimen Laboral', 'Etiqueta Régimen Laboral Activa')
    }
    else if (nombreRegimen === 'CODIGO DE TRABAJO') {
      (<HTMLInputElement>document.getElementById('nombreR')).style.visibility = 'hidden';
      this.LimpiarDiasMeses();
      this.IngresarDatosCodigoTrabajo();
    }
    else if (nombreRegimen === 'LOSEP') {
      (<HTMLInputElement>document.getElementById('nombreR')).style.visibility = 'hidden';
      this.LimpiarDiasMeses();
      this.IngresarDatosLosep();
    }
    else if (nombreRegimen === 'LOES') {
      (<HTMLInputElement>document.getElementById('nombreR')).style.visibility = 'hidden';
      this.LimpiarDiasMeses();
      this.IngresarDatosLoes();
    }
    else {
      (<HTMLInputElement>document.getElementById('nombreR')).style.visibility = 'hidden';
      this.IngresarDatosOtro();
      this.LimpiarDiasMeses();
      this.toastr.info('No ha seleccionado ninguna opción')
    }
  }

  IngresarDatosCodigoTrabajo() {
    this.RegimenForm.patchValue({
      diaAnioVacacionForm: 11,
      diaLibreAnioVacacionForm: 4,
      anioAntiguedadForm: 5,
      diaIncrAntiguedadForm: 1,
    });
  }

  IngresarDatosLosep() {
    this.RegimenForm.patchValue({
      diaAnioVacacionForm: 22,
      diaLibreAnioVacacionForm: 8,
      anioAntiguedadForm: 5,
      diaIncrAntiguedadForm: 1,
    });
  }

  IngresarDatosLoes() {
    this.RegimenForm.patchValue({
      diaAnioVacacionForm: 11,
      diaLibreAnioVacacionForm: 4,
      anioAntiguedadForm: 5,
      diaIncrAntiguedadForm: 1,
    });
  }

  IngresarDatosOtro() {
    this.RegimenForm.patchValue({
      diaAnioVacacionForm: '',
      diaLibreAnioVacacionForm: '',
      anioAntiguedadForm: '',
      diaIncrAntiguedadForm: '',
    });
  }

  InsertarRegimen(form) {
    var nombreRegimen = form.regimenForm;
    var escribirRegimen = form.descripcionForm;
    let datosRegimen = {
      descripcion: escribirRegimen,
      dia_anio_vacacion: form.diaAnioVacacionForm,
      dia_incr_antiguedad: form.diaIncrAntiguedadForm,
      anio_antiguedad: form.anioAntiguedadForm,
      dia_mes_vacacion: form.diaMesVacacionForm,
      max_dia_acumulacion: form.maxDiasAcumulacionForm,
      dia_libr_anio_vacacion: form.diaLibreAnioVacacionForm
    };
    if (nombreRegimen === 'OTRO') {
      if (escribirRegimen === '') {
        this.toastr.info('Ingresar nombre del nuevo Régimen Laboral', 'Campo Obligatorio');
      }
      else {
        datosRegimen.descripcion = escribirRegimen;
        this.CambiarValores(datosRegimen);
        this.VerificarValoresMenores(datosRegimen);
      }
    }
    else if (nombreRegimen === 'Seleccionar') {
      this.toastr.info('Seleccionar nombre del nuevo Régimen Laboral', 'Campo Obligatorio');
    }
    else {
      datosRegimen.descripcion = nombreRegimen;
      this.CambiarValores(datosRegimen);
      this.VerificarValoresMenores(datosRegimen);
    }
  }

  CambiarValores(datos) {
    if (datos.dia_libr_anio_vacacion === '') {
      datos.dia_libr_anio_vacacion = 0;
    }
  }

  VerificarValoresMenores(datos) {
    var diasAnio = datos.dia_anio_vacacion;
    var diasLibres = datos.dia_libr_anio_vacacion;
    var diasIncremento = datos.dia_incr_antiguedad;
    var diasAcumulados = datos.max_dia_acumulacion;
    if (parseInt(diasAnio) > parseInt(diasAcumulados)) {
      this.toastr.info('Días máximos acumulados deben ser mayores a los días de vacación por año')
    }
    else if (parseInt(diasLibres) > parseInt(diasAnio)) {
      this.toastr.info('Días libres de vacaciones deben ser menores a los días de vacación por año')
    }
    else if (parseInt(diasIncremento) > parseInt(diasAnio)) {
      this.toastr.info('Días de incremento por antiguedad deben ser menores a los días de vacación por año')
    }
    else {
      this.FuncionInsertarDatos(datos);
    }
  }

  CalcularDiasMeses(form) {
    if ((<HTMLInputElement>document.getElementById('activo')).checked) {
      var diasAnio = form.diaAnioVacacionForm;
      if (diasAnio === '') {
        this.toastr.info('No ha ingresado días por año');
        (<HTMLInputElement>document.getElementById('activo')).checked = false;
      }
      else {
        var diasMes = (parseInt(diasAnio) / 12).toFixed(6);
        this.RegimenForm.patchValue({
          diaMesVacacionForm: diasMes,
        });
      }
    }
    else {
      this.LimpiarDiasMeses();
    }
  }

  FuncionInsertarDatos(datos) {
    this.rest.CrearNuevoRegimen(datos).subscribe(response => {
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

  ObtenerMensajeErrorNombreRequerido() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Ingresar un nombre válido';
    }
  }

  ObtenerMensajeErrorCamposNumericosRequeridos() {
    if (this.diaAnioVacacionF.hasError('required')) {
      return 'Campo obligatorio ingrese un valor';
    }
  }

  ObtenerMensajeErrorDiasAcumulablesRequerido() {
    if (this.maxDiasAcumulacionF.hasError('required')) {
      return 'Campo obligatorio ingrese un valor';
    }
  }

  ObtenerMensajeErrorAnioAntiguedadRequerido() {
    if (this.anioAntiguedadF.hasError('required')) {
      return 'Campo obligatorio ingrese un valor';
    }
  }

  ObtenerMensajeErrorIncreAntiguedadRequerido() {
    if (this.diaIncrAntiguedadF.hasError('required')) {
      return 'Campo obligatorio ingrese un valor';
    }
  }

  LimpiarCampos() {
    this.RegimenForm.reset();
    (<HTMLInputElement>document.getElementById('activo')).checked = false;
  }

  CerrarVentanaRegistroRegimen() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

  LimpiarDiasMeses() {
    this.RegimenForm.patchValue({
      diaMesVacacionForm: '',
      descripcionForm: '',
    });
    (<HTMLInputElement>document.getElementById('activo')).checked = false;
  }

}
