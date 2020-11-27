import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.component.html',
  styleUrls: ['./editar-empresa.component.css']
})
export class EditarEmpresaComponent implements OnInit {

  valor = '';
  selec1 = false;
  selec2 = false;
  selec3 = false;
  selec4 = false;
  selec5 = false;
  selec6 = false;
  selec7 = false;
  selec8 = false;
  selec9 = false;
  selec10 = false;

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  direccionF = new FormControl('', [Validators.required, Validators.minLength(6)]);
  rucF = new FormControl('', [Validators.required]);
  correoF = new FormControl('', [Validators.required, Validators.email]);
  telefonoF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', [Validators.required]);
  representanteF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  otroF = new FormControl('', [Validators.minLength(3)]);
  establecimientoF = new FormControl('', [Validators.required]);
  otroE = new FormControl('', [Validators.minLength(3)]);
  dias_cambioF = new FormControl('');
  cambiosF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public RegistroEmpresaForm = new FormGroup({
    nombreForm: this.nombreF,
    rucForm: this.rucF,
    telefonoForm: this.telefonoF,
    direccionForm: this.direccionF,
    correoForm: this.correoF,
    tipoForm: this.tipoF,
    representanteForm: this.representanteF,
    otroForm: this.otroF,
    establecimientoForm: this.establecimientoF,
    otroEForm: this.otroE,
    dias_cambioForm: this.dias_cambioF,
    cambiosForm: this.cambiosF
  });


  constructor(
    private toastr: ToastrService,
    private rest: EmpresaService,
    public dialogRef: MatDialogRef<EditarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  HabilitarOtro: boolean = true;
  estiloOtro: any;
  HabilitarRepre: boolean = true;
  estiloRepre: any;
  HabilitarOtroE: boolean = true;
  estiloOtroE: any;
  habilitarDias: boolean = true;
  estiloDias: any;

  ngOnInit(): void {
    console.log('data', this.data)
    this.ImprimirDatos();
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.nombreF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeErrorDireccionRequerido() {
    if (this.direccionF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeErrorRucRequerido() {
    if (this.rucF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeErrorTelefonoRequerido() {
    if (this.telefonoF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeErrorCorreoRequerido() {
    if (this.correoF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeErrorRepre() {
    if (this.representanteF.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.representanteF.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

  ImprimirDatos() {
    if (this.data.tipo_empresa === 'Pública') {
      this.selec1 = true;
      this.CambiarNombrePublica();
    }
    else if (this.data.tipo_empresa === 'Privada') {
      this.selec2 = true;
      this.CambiarNombrePrivada();
    }
    else if (this.data.tipo_empresa === 'ONG') {
      this.selec3 = true;
      this.CambiarNombreOng();
    }
    else if (this.data.tipo_empresa === 'Persona Natural') {
      this.selec4 = true;
      this.CambiarNombreNatural();
    }
    else {
      this.selec5 = true;
      this.estiloOtro = { 'visibility': 'visible' }; this.HabilitarOtro = false;
      this.estiloRepre = { 'visibility': 'visible' }; this.HabilitarRepre = false;
      this.valor = 'Representante Legal';
      this.RegistroEmpresaForm.patchValue({
        otroForm: this.data.tipo_empresa
      })
    }
    if (this.data.establecimiento === 'Sucursales') {
      this.selec6 = true;
      this.CambiarSucursalesAgencias();
    }
    else if (this.data.establecimiento === 'Agencias') {
      this.selec7 = true;
      this.CambiarSucursalesAgencias();
    }
    else {
      this.selec8 = true;
      this.estiloOtroE = { 'visibility': 'visible' }; this.HabilitarOtroE = false;
      this.RegistroEmpresaForm.patchValue({
        otroEForm: this.data.establecimiento
      })
    }
    if (this.data.cambios === true) {
      this.selec9 = true
      this.estiloDias = { 'visibility': 'visible' }; this.habilitarDias = false;
      this.RegistroEmpresaForm.patchValue({
        dias_cambioForm: this.data.dias_cambio
      })
    }
    else {
      this.selec10 = true;
      this.RealizarCambiosNo();
    }
    this.RegistroEmpresaForm.patchValue({
      nombreForm: this.data.nombre,
      rucForm: this.data.ruc,
      telefonoForm: this.data.telefono,
      direccionForm: this.data.direccion,
      correoForm: this.data.correo,
      tipoForm: this.data.tipo_empresa,
      representanteForm: this.data.representante,
      establecimientoForm: this.data.establecimiento,
      cambiosForm: this.data.cambios
    })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  LimpiarCampos() {
    this.RegistroEmpresaForm.reset();
  }

  InsertarEmpresa(form) {
    let datosEmpresa = {
      id: this.data.id,
      nombre: form.nombreForm,
      ruc: form.rucForm,
      direccion: form.direccionForm,
      telefono: form.telefonoForm,
      correo: form.correoForm,
      tipo_empresa: form.tipoForm,
      representante: form.representanteForm,
      establecimiento: form.establecimientoForm,
      dias_cambio: form.dias_cambioForm,
      cambios: form.cambiosForm
    };
    this.VerificarCambios(form, datosEmpresa);
  }

  GuardarDatos(datos) {
    this.rest.ActualizarEmpresa(datos).subscribe(response => {
      this.CerrarVentanaRegistroEmpresa();
      this.toastr.success('Operación Exitosa', 'Datos de Empresa actualizados', {
        timeOut: 6000,
      })
    }, error => {
    });
  }

  VerificarOtroTipo(form, datos) {
    if (form.tipoForm === 'Otro') {
      if (form.otroForm != '') {
        datos.tipo_empresa = form.otroForm;
        this.VerificarEstablecimiento(form, datos);
      }
      else {
        this.toastr.info('Ingrese el nombre del tipo de empresa.', '', {
          timeOut: 6000,
        })
      }
    }
    else {
      this.VerificarEstablecimiento(form, datos);
    }
  }

  VerificarCambios(form, datos) {
    if (form.cambiosForm === "true" || form.cambiosForm === true) {
      if (form.dias_cambioForm != '') {
        this.VerificarOtroTipo(form, datos);
      }
      else {
        this.toastr.info('Ingrese el número de días para realizar cambios antes de la fecha de cumplimiento de una autorización de solicitud de permisos, vacaciones u horas extras.', '', {
          timeOut: 6000,
        })
      }
    }
    else {
      datos.dias_cambio = 0;
      this.VerificarOtroTipo(form, datos);
    }
  }

  VerificarEstablecimiento(form, datos) {
    if (form.establecimientoForm === 'Otro') {
      if (form.otroEForm != '') {
        datos.establecimiento = form.otroEForm;
        // this.GuardarDatos(datos);
      }
      else {
        this.toastr.info('Ingrese el nombre del establecimiento.', '', {
          timeOut: 6000,
        })
      }
    }
    else {
      this.GuardarDatos(datos);
    }
  }

  CambiarNombrePublica() {
    this.estiloOtro = { 'visibility': 'hidden' }; this.HabilitarOtro = true;
    this.estiloRepre = { 'visibility': 'visible' }; this.HabilitarRepre = false;
    this.valor = 'Máxima Autoridad'
    this.RegistroEmpresaForm.patchValue({
      otroForm: ''
    })
  }

  CambiarNombrePrivada() {
    this.estiloOtro = { 'visibility': 'hidden' }; this.HabilitarOtro = true;
    this.estiloRepre = { 'visibility': 'visible' }; this.HabilitarRepre = false;
    this.valor = 'Representante Legal'
    this.RegistroEmpresaForm.patchValue({
      otroForm: ''
    })
  }

  CambiarNombreOng() {
    this.estiloOtro = { 'visibility': 'hidden' }; this.HabilitarOtro = true;
    this.estiloRepre = { 'visibility': 'visible' }; this.HabilitarRepre = false;
    this.valor = 'Representante Legal'
    this.RegistroEmpresaForm.patchValue({
      otroForm: ''
    })
  }

  CambiarNombreNatural() {
    this.estiloOtro = { 'visibility': 'hidden' }; this.HabilitarOtro = true;
    this.estiloRepre = { 'visibility': 'visible' }; this.HabilitarRepre = false;
    this.valor = 'Representante Legal'
    this.RegistroEmpresaForm.patchValue({
      otroForm: ''
    })
  }

  CambiarNombreOtro() {
    this.estiloOtro = { 'visibility': 'visible' }; this.HabilitarOtro = false;
    this.estiloRepre = { 'visibility': 'visible' }; this.HabilitarRepre = false;
    this.toastr.info('Ingresar el nombre del tipo de empresa', '', {
      timeOut: 6000,
    })
    this.valor = 'Representante Legal';
    this.RegistroEmpresaForm.patchValue({
      otroForm: ''
    })
  }

  CambiarSucursalesAgencias() {
    this.estiloOtroE = { 'visibility': 'hidden' }; this.HabilitarOtroE = true;
    this.RegistroEmpresaForm.patchValue({
      otroEForm: ''
    })
  }

  CambiarEstablecimiento() {
    this.estiloOtroE = { 'visibility': 'visible' }; this.HabilitarOtroE = false;
    this.toastr.info('Ingresar el nombre del establecimiento que tiene la empresa.', '', {
      timeOut: 6000,
    })
    this.RegistroEmpresaForm.patchValue({
      otroEForm: ''
    })
  }

  RealizarCambiosNo() {
    this.estiloDias = { 'visibility': 'hidden' }; this.habilitarDias = true;
    this.RegistroEmpresaForm.patchValue({
      dias_cambioForm: ''
    })
  }

  RealizarCambiosSi() {
    this.estiloDias = { 'visibility': 'visible' }; this.habilitarDias = false;
    this.toastr.info('Ingresar el número de días que tendra para realizar cambios de una autorización antes que se cumpla la fecha de cumpliento de esta.', '', {
      timeOut: 6000,
    })
    this.RegistroEmpresaForm.patchValue({
      dias_cambioForm: ''
    })
  }

  CerrarVentanaRegistroEmpresa() {
    this.LimpiarCampos();
    this.dialogRef.close();
    //window.location.reload();
    this.valor = '';
  }

  Salir() {
    this.LimpiarCampos();
    this.dialogRef.close();
    this.valor = '';
  }

}
