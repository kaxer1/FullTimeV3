import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RelojesService } from 'src/app/servicios/catalogos/relojes/relojes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relojes',
  templateUrl: './relojes.component.html',
  styleUrls: ['./relojes.component.css']
})
export class RelojesComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required]);
  ipF = new FormControl('', Validators.pattern("[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}"));
  puertoF = new FormControl('', Validators.pattern('[0-9]{4}'));
  contraseniaF = new FormControl('');
  marcaF = new FormControl('');
  modeloF = new FormControl('');
  serieF = new FormControl('', Validators.pattern('[0-9]{0,3}'));
  idFabricacionF = new FormControl('');
  fabricanteF = new FormControl('');
  macF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public RelojesForm = new FormGroup({
    nombreForm: this.nombreF,
    ipForm: this.ipF,
    puertoForm: this.puertoF,
    contraseniaForm: this.contraseniaF,
    marcaForm: this.marcaF,
    modeloForm: this.modeloF,
    serieForm: this.serieF,
    idFabricacionForm: this.idFabricacionF,
    fabricanteForm: this.fabricanteF,
    macForm: this.macF
  });

  constructor(
    private rest: RelojesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  InsertarReloj(form) {
    let datosReloj = {
      nombre: form.nombreForm,
      ip: form.ipForm,
      puerto: form.puertoForm,
      contrasenia: form.contraseniaForm,
      marca: form.marcaForm,
      modelo: form.modeloForm,
      serie: form.serieForm,
      id_fabricacion: form.idFabricacionForm,
      fabricante: form.fabricanteForm,
      mac: form.macForm
    };

    this.rest.CrearNuevoReloj(datosReloj).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Reloj registrado')
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Reloj no se pudo registrar')

    });
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.nombreF.hasError('required')) {
      return 'Debe ingresar un nombre';
    }
  }

  ObtenerMensajeErrorIp() {
    if (this.ipF.hasError('pattern')) {
      return 'Ingresar IP: 0.0.0.0';
    }

  }
  ObtenerMensajeErrorPuerto() {
    if (this.puertoF.hasError('pattern')) {
      return 'Ingresar 4 números';
    }
  }

  ObtenerMensajeErrorSerie() {
    if (this.serieF.hasError('pattern')) {
      return 'No ingresar letras';
    }
  }


  IngresarIp(evt) {
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
    this.RelojesForm.reset();
  }

}
