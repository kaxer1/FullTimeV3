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

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  direccionF = new FormControl('', [Validators.required, Validators.minLength(6)]);
  rucF = new FormControl('', [Validators.required]);
  correoF = new FormControl('', [Validators.required, Validators.email]);
  telefonoF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', [Validators.required]);
  representanteF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);

  // Asignación de validaciones a inputs del formulario
  public RegistroEmpresaForm = new FormGroup({
    nombreForm: this.nombreF,
    rucForm: this.rucF,
    telefonoForm: this.telefonoF,
    direccionForm: this.direccionF,
    correoForm: this.correoF,
    tipoForm: this.tipoF,
    representanteForm: this.representanteF
  });

  constructor(
    private toastr: ToastrService,
    private rest: EmpresaService,
    public dialogRef: MatDialogRef<EditarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
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
    
    if (this.data.tipo_empresa === 1) {
      this.selec1 = true;
      this.CambiarNombrePublica();
    }
    else if (this.data.tipo_empresa === 2) {
      this.selec2 = true;
      this.CambiarNombrePrivada();
    }
    else {
      this.selec3 = true;
      this.CambiarNombreOng();
    }
    this.RegistroEmpresaForm.patchValue({
      nombreForm: this.data.nombre,
      rucForm: this.data.ruc,
      telefonoForm: this.data.telefono,
      direccionForm: this.data.direccion,
      correoForm: this.data.correo,
      tipoForm: this.data.tipo_empresa,
      representanteForm: this.data.representante
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
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
      representante: form.representanteForm
    };
    this.rest.ActualizarEmpresa(datosEmpresa).subscribe(response => {
      this.CerrarVentanaRegistroEmpresa();
      this.toastr.success('Operación Exitosa', 'Datos de Empresa actualizados')
    }, error => {
    });
  }

  CambiarNombrePublica() {
    if ((<HTMLInputElement>document.getElementById('pub')).value = '1') {
      (<HTMLInputElement>document.getElementById('repre')).style.visibility = 'visible';
      //this.toastr.info('Ingresar número de días para presentar justificación')
      this.valor = 'Máxima Autoridad'
    }

  }

  CambiarNombrePrivada() {
    if ((<HTMLInputElement>document.getElementById('pri')).value = '2') {
      (<HTMLInputElement>document.getElementById('repre')).style.visibility = 'visible';
      //this.toastr.info('Ingresar número de días para presentar justificación')
      this.valor = 'Representante Legal'
    }
  }

  CambiarNombreOng() {
    if ((<HTMLInputElement>document.getElementById('ong')).value = '3') {
      (<HTMLInputElement>document.getElementById('repre')).style.visibility = 'visible';
      //this.toastr.info('Ingresar número de días para presentar justificación')
      this.valor = 'Representante Legal'
    }
  }

  CerrarVentanaRegistroEmpresa() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
    this.valor = '';
  }


}
