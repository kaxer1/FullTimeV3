import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';

interface TipoDescuentos {
  value: string;
  viewValue: string;
}

interface opcionesPermisos {
  valor: string;
  nombre: string
}

interface opcionesSolicitud {
  valor: number;
  nombre: string
}

interface opcionesDiasHoras {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-tipo-permisos',
  templateUrl: './tipo-permisos.component.html',
  styleUrls: ['./tipo-permisos.component.css'],
})

export class TipoPermisosComponent implements OnInit {

  descuentos: TipoDescuentos[] = [
    { value: '1', viewValue: 'Vacaciones' },
    { value: '2', viewValue: 'Ninguno' },
  ];

  solicitudes: opcionesSolicitud[] = [
    { valor: 1, nombre: 'Si' },
    { valor: 2, nombre: 'No' },
  ];

  diasHoras: opcionesDiasHoras[] = [
    { valor: 'Días', nombre: 'Días' },
    { valor: 'Horas', nombre: 'Horas' },
    { valor: 'Días y Horas', nombre: 'Días y Horas' },
  ];

  validarGuardar: boolean = false;

  // Arreglo de opcionesPermisos existentes
  permisos: opcionesPermisos[] = [
    { valor: 'Seleccionar', nombre: 'Seleccionar' },
    { valor: 'Asuntos Personales', nombre: 'Asuntos Personales' },
    { valor: 'Calamidad Doméstica', nombre: 'Calamidad Doméstica' },
    { valor: 'Cita Médica', nombre: 'Cita Médica' },
    { valor: 'Enfermedad', nombre: 'Enfermedad' },
    { valor: 'Estudios', nombre: 'Estudios' },
    { valor: 'Maternidad', nombre: 'Maternidad' },
    { valor: 'Paternidad', nombre: 'Paternidad' },
    { valor: 'Sufragio', nombre: 'Sufragio' },
    { valor: 'OTRO', nombre: 'OTRO' },
  ];
  seleccionarPermiso: string = this.permisos[0].valor;

  isLinear = true;
  primeroFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  terceroFormGroup: FormGroup;

  constructor(
    private rest: TipoPermisosService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
  ) { }

  HabilitarOtro: boolean = true;
  estiloOtro: any;
  HabilitarJustifica: boolean = true;
  estiloJustifica: any;
  HabilitarDias: boolean = true;
  estiloDias: any;
  HabilitarHoras: boolean = true;
  estiloHoras: any;

  ngOnInit(): void {
    this.primeroFormGroup = this._formBuilder.group({
      descripcionForm: ['', Validators.required],
      nombreForm: [''],
      numDiaMaximoForm: [''],
      numHoraMaximoForm: [''],
      numDiaIngresoForm: ['', Validators.required],
      acceEmpleadoForm: ['', Validators.required],
      almuIncluirForm: ['', Validators.required],
      diasHorasForm: ['', Validators.required]
    });
    this.segundoFormGroup = this._formBuilder.group({
      vacaAfectaForm: ['', Validators.required],
      anioAcumulaForm: ['', Validators.required],
      actualizarForm: ['', Validators.required],
      eliminarForm: ['', Validators.required],
      tipoDescuentoForm: ['', Validators.required],
    });
    this.terceroFormGroup = this._formBuilder.group({
      autorizarForm: ['', Validators.required],
      legalizarForm: ['', Validators.required],
      preautorizarForm: ['', Validators.required],
      fecValidarForm: ['', Validators.required],
      geneJustificacionForm: ['', Validators.required],
      numDiaJustificaForm: [''],
    });
  }

  insertarTipoPermiso(form1, form2, form3) {
    var nombrePermiso = form1.descripcionForm;
    var nuevoPermiso = form1.nombreForm;
    let dataTipoPermiso = {
      descripcion: form1.descripcionForm,
      tipo_descuento: form2.tipoDescuentoForm,
      num_dia_maximo: form1.numDiaMaximoForm,
      num_dia_ingreso: form1.numDiaIngresoForm,
      vaca_afecta: form2.vacaAfectaForm,
      anio_acumula: form2.anioAcumulaForm,
      gene_justificacion: form3.geneJustificacionForm,
      fec_validar: form3.fecValidarForm,
      acce_empleado: form1.acceEmpleadoForm,
      actualizar: form2.actualizarForm,
      autorizar: form3.autorizarForm,
      eliminar: form2.eliminarForm,
      legalizar: form3.legalizarForm,
      preautorizar: form3.preautorizarForm,
      almu_incluir: form1.almuIncluirForm,
      num_dia_justifica: form3.numDiaJustificaForm,
      num_hora_maximo: form1.numHoraMaximoForm,
    }
    if (nombrePermiso === 'OTRO') {
      if (nuevoPermiso === '') {
        this.toastr.info('Ingresar nombre del nuevo Tipo de Permiso', 'Información General');
      }
      else {
        dataTipoPermiso.descripcion = nuevoPermiso;
        this.VerificarJustificacion(form1, dataTipoPermiso);
      }
    }
    else if (nombrePermiso === 'Seleccionar') {
      this.toastr.info('Seleccionar o definir una descripción del nuevo tipo de permiso', 'Información General');
    }
    else {
      this.VerificarJustificacion(form1, dataTipoPermiso);
    }
  }

  IngresarDatos(datos) {
    this.validarGuardar = true;
    this.rest.postTipoPermisoRest(datos).subscribe(res => {
      if (res.message === 'error') {
        this.toastr.error('Revisarlo en la lista de Tipo de Permisos y actualizar los datos si desea realizar cambios en la configuración del permiso', 'Tipo de Permiso ya esta configurado');
      }
      else {
        this.toastr.success('Operación Exitosa', 'Tipo Permiso guardado');
        window.location.reload();
      }
    }, error => { });
  }

  ActivarDesactivarNombre(form1) {
    var nombreTipoPermiso = form1.descripcionForm;
    if (nombreTipoPermiso === 'OTRO') {
      this.estiloOtro = { 'visibility': 'visible' }; this.HabilitarOtro = false;
      this.toastr.info('Ingresar nombre del nuevo Tipo de Permiso', 'Etiqueta Descripción activa')
    }
    else if (nombreTipoPermiso === 'Seleccionar') {
      this.LimpiarCampoNombre();
      this.estiloOtro = { 'visibility': 'hidden' }; this.HabilitarOtro = true;
      this.toastr.info('No ha seleccionado ninguna opción');
    }
    else {
      this.LimpiarCampoNombre();
      this.estiloOtro = { 'visibility': 'hidden' }; this.HabilitarOtro = true;
    }

  }

  ActivarJustificacion() {
    if ((<HTMLInputElement>document.getElementById('si')).value = 'true') {
      this.estiloJustifica = { 'visibility': 'visible' }; this.HabilitarJustifica = false;
      this.toastr.info('Ingresar número de días para presentar justificación')
    }
  }

  DesactivarJustificacion() {
    if ((<HTMLInputElement>document.getElementById('no')).value = 'false') {
      this.estiloJustifica = { 'visibility': 'hidden' }; this.HabilitarJustifica = true;
      this.terceroFormGroup.patchValue({
        numDiaJustificaForm: '',
      })
    }
  }

  VerificarJustificacion(form1, datos) {
    if (datos.num_dia_justifica === '' && datos.gene_justificacion === 'true') {
      this.toastr.info('Ingresar número de días para presentar justificación')
    }
    else if (datos.num_dia_justifica != '' && datos.gene_justificacion === 'true') {
      this.CambiarValoresDiasHoras(form1, datos);
      this.IngresarDatos(datos);
    }
    else if (datos.num_dia_justifica === '' && datos.gene_justificacion === 'false') {
      datos.num_dia_justifica = 0;
      this.CambiarValoresDiasHoras(form1, datos);
      this.IngresarDatos(datos);
    }
  }

  ActivarDiasHoras(form) {
    if (form.diasHorasForm === 'Días') {
      this.primeroFormGroup.patchValue({
        numDiaMaximoForm: '',
      });
      this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
      this.estiloHoras = { 'visibility': 'hidden' }; this.HabilitarHoras = true;
      this.toastr.info('Ingresar número de días máximos de permiso');
    }
    else if (form.diasHorasForm === 'Horas') {
      this.primeroFormGroup.patchValue({
        numHoraMaximoForm: '',
      });
      this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras= false;
      this.estiloDias = { 'visibility': 'hidden' }; this.HabilitarDias = true;
      this.toastr.info('Ingresar número de horas y minutos máximos de permiso');
    }
    else {
      this.primeroFormGroup.patchValue({
        numHoraMaximoForm: '',
        numDiaMaximoForm: ''
      });
      this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras= false;
      this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
      this.toastr.info('Ingresar número de días máximos y horas permitidas de permiso');
    }
  }

  CambiarValoresDiasHoras(form, datos) {
    if (form.diasHorasForm === 'Días') {
      if (datos.num_dia_maximo === '') {
        this.toastr.info('Ingresar número de días máximos de permiso');
      }
      else {
        datos.num_hora_maximo = '00:00';
      }
    }
    else if (form.diasHorasForm === 'Horas') {
      if (datos.num_hora_maximo === '') {
        this.toastr.info('Ingresar número de horas y minutos máximos de permiso');
      }
      else {
        datos.num_dia_maximo = 0;
      }
    }
    else if (form.diasHorasForm === 'Días y Horas') {
      if (datos.num_hora_maximo === '' || datos.num_dia_maximo === '') {
        this.toastr.info('Ingresar número de días, horas y minutos máximos de permiso');
      }
    }
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

  LimpiarCampoNombre() {
    this.primeroFormGroup.patchValue({
      nombreForm: '',
    });
  }

}
