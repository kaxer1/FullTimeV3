import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { ToastrService } from 'ngx-toastr';

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

@Component({
  selector: 'app-tipo-permisos',
  templateUrl: './tipo-permisos.component.html',
  styleUrls: ['./tipo-permisos.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TipoPermisosComponent implements OnInit {

  descuentos: TipoDescuentos[] = [
    { value: '1', viewValue: 'Vacaciones' },
    { value: '2', viewValue: 'desc2' },
  ];

  solicitudes: opcionesSolicitud[] = [
    { valor: 1, nombre: 'Si' },
    { valor: 2, nombre: 'No' },
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
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.primeroFormGroup = this._formBuilder.group({
      descripcionForm: ['', Validators.required],
      nombreForm: [''],
      numDiaMaximoForm: ['', Validators.required],
      numHoraMaximoForm: ['', Validators.required],
      numDiaIngresoForm: ['', Validators.required],
      acceEmpleadoForm: ['', Validators.required],
      almuIncluirForm: ['', Validators.required]
    });
    this.segundoFormGroup = this._formBuilder.group({
      vacaAfectaForm: ['', Validators.required],
      anioAcumulaForm: ['', Validators.required],
      correoForm: ['', Validators.required],
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
      num_hora_maximo: form1.numHoraMaximoForm,
      num_dia_ingreso: form1.numDiaIngresoForm,
      vaca_afecta: form2.vacaAfectaForm,
      anio_acumula: form2.anioAcumulaForm,
      correo: form2.correoForm,
      gene_justificacion: form3.geneJustificacionForm,
      fec_validar: form3.fecValidarForm,
      acce_empleado: form1.acceEmpleadoForm,
      actualizar: form2.actualizarForm,
      autorizar: form3.autorizarForm,
      eliminar: form2.eliminarForm,
      legalizar: form3.legalizarForm,
      preautorizar: form3.preautorizarForm,
      almu_incluir: form1.almuIncluirForm,
      num_dia_justifica: form3.numDiaJustificaForm
    }
    if (nombrePermiso === 'OTRO') {
      if (nuevoPermiso === '') {
        this.toastr.info('Ingresar nombre del nuevo Tipo de Permiso', 'Información General');
      }
      else {
        dataTipoPermiso.descripcion = nuevoPermiso;
        this.VerificarJustificacion(dataTipoPermiso);
      }
    }
    else if (nombrePermiso === 'Seleccionar') {
      this.toastr.info('Seleccionar o definir una descripción del nuevo tipo de permiso', 'Información General');
    }
    else {
      this.VerificarJustificacion(dataTipoPermiso);
    }
  }

  IngresarDatos(datos) {
    this.validarGuardar = true;
    this.rest.postTipoPermisoRest(datos).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Tipo Permiso guardado');
      window.location.reload();
    }, error => {
    });
  }

  ActivarDesactivarNombre(form1) {
    var nombreTipoPermiso = form1.descripcionForm;
    if (nombreTipoPermiso === 'OTRO') {
      (<HTMLInputElement>document.getElementById('nombreTP')).style.visibility = 'visible';
      this.toastr.info('Ingresar nombre del nuevo Tipo de Permiso', 'Etiqueta Descripción activa')
    }
    else if (nombreTipoPermiso === 'Seleccionar') {
      this.LimpiarCampoNombre();
      (<HTMLInputElement>document.getElementById('nombreTP')).style.visibility = 'hidden';
      this.toastr.info('No ha seleccionado ninguna opción');
    }
    else {
      this.LimpiarCampoNombre();
      (<HTMLInputElement>document.getElementById('nombreTP')).style.visibility = 'hidden';
    }

  }

  ActivarJustificacion(form3) {
    if ((<HTMLInputElement>document.getElementById('si')).value = 'true') {
      (<HTMLInputElement>document.getElementById('diasJustificar')).style.visibility = 'visible';
      this.toastr.info('Ingresar número de días para presentar justificación')
    }
  }

  DesactivarJustificacion(form3) {
    if ((<HTMLInputElement>document.getElementById('no')).value = 'false') {
      (<HTMLInputElement>document.getElementById('diasJustificar')).style.visibility = 'hidden';
      this.terceroFormGroup.patchValue({
        numDiaJustificaForm: '',
      })
    }
  }

  VerificarJustificacion(datos) {
    if (datos.num_dia_justifica === '' && datos.gene_justificacion === 'true') {
      this.toastr.info('Ingresar número de días para presentar justificación')
    }
    else if (datos.num_dia_justifica != '' && datos.gene_justificacion === 'true') {
      this.IngresarDatos(datos);
    }
    else if (datos.num_dia_justifica === '' && datos.gene_justificacion === 'false') {
      datos.num_dia_justifica = 0;
      this.IngresarDatos(datos);
    }
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!((key >= 33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225)))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  LimpiarCampoNombre() {
    this.primeroFormGroup.patchValue({
      nombreForm: '',
    });
  }

}
