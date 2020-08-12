import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class RegistroEmpresaComponent implements OnInit {

  valor = '';

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  direccionF = new FormControl('', [Validators.required, Validators.minLength(6)]);
  rucF = new FormControl('', [Validators.required]);
  correoF = new FormControl('', [Validators.required, Validators.email]);
  telefonoF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', [Validators.required]);
  representanteF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  otroF = new FormControl('', [Validators.minLength(3)]);

  // Asignación de validaciones a inputs del formulario
  public RegistroEmpresaForm = new FormGroup({
    nombreForm: this.nombreF,
    rucForm: this.rucF,
    telefonoForm: this.telefonoF,
    direccionForm: this.direccionF,
    correoForm: this.correoF,
    tipoForm: this.tipoF,
    representanteForm: this.representanteF,
    otroForm: this.otroF
  });

  constructor(
    private toastr: ToastrService,
    private rest: EmpresaService,
    public dialogRef: MatDialogRef<RegistroEmpresaComponent>,
  ) { }


  HabilitarOtro: boolean = true;
  estiloOtro: any;
  HabilitarRepre: boolean = true;
  estiloRepre: any;

  ngOnInit(): void {
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

  LimpiarCampos() {
    this.RegistroEmpresaForm.reset();
  }

  InsertarEmpresa(form) {
    let datosEmpresa = {
      nombre: form.nombreForm,
      ruc: form.rucForm,
      direccion: form.direccionForm,
      telefono: form.telefonoForm,
      correo: form.correoForm,
      tipo_empresa: form.tipoForm,
      representante: form.representanteForm
    };
    this.VerificarOtroTipo(form, datosEmpresa);
  }

  GuardarDatos(datos){
    this.rest.IngresarEmpresas(datos).subscribe(response => {
      this.LimpiarCampos();
      this.toastr.success('Operación Exitosa', 'Datos de Empresa registrados')
    }, error => {
    });
  }

  VerificarOtroTipo(form, datos) {
    if (form.tipoForm === 'Otro') {
      if (form.otroForm != '') {
        datos.tipo_empresa = form.otroForm;
        this.GuardarDatos(datos);
      }
      else {
        this.toastr.info('Ingrese el nombre del tipo de empresa')
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
    this.toastr.info('Ingresar el nombre del tipo de empresa')
    this.valor = 'Representante Legal'
    this.RegistroEmpresaForm.patchValue({
      otroForm: ''
    })
  }

  CerrarVentanaRegistroEmpresa() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
    this.valor = '';
  }

}
