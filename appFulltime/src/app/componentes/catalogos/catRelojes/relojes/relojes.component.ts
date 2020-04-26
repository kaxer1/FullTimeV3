import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RelojesService } from 'src/app/servicios/catalogos/catRelojes/relojes.service';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';


@Component({
  selector: 'app-relojes',
  templateUrl: './relojes.component.html',
  styleUrls: ['./relojes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RelojesComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  ipF = new FormControl('', [Validators.required, Validators.pattern("[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}")]);
  puertoF = new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}')]);
  contraseniaF = new FormControl('', [Validators.minLength(4)]);
  marcaF = new FormControl('', [Validators.minLength(4)]);
  modeloF = new FormControl('', [Validators.minLength(4)]);
  serieF = new FormControl('', Validators.pattern('[0-9]{0,3}'));
  idFabricacionF = new FormControl('', [Validators.minLength(4)]);
  fabricanteF = new FormControl('', [Validators.minLength(4)]);
  funcionesF = new FormControl('', [Validators.required]);
  macF = new FormControl('');
  idSucursalesF = new FormControl('', [Validators.required]);
  idDepartamentoF = new FormControl('', [Validators.required]);

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
    macForm: this.macF,
    funcionesForm: this.funcionesF,
    idSucursalForm: this.idSucursalesF, 
    idDepartamentoForm: this.idDepartamentoF
  });

  sucursales: any = [];

  constructor(
    private rest: RelojesService,
    private restSucursal: SucursalService,
    private restDepartamento: DepartamentosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RelojesComponent>,
  ) { }

  ngOnInit(): void {
    this.ObtenerSucursales();
  }

  ObtenerSucursales(){
    this.restSucursal.getSucursalesRest().subscribe(res => {
      this.sucursales = res;
      console.log(this.sucursales);
    })
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
      mac: form.macForm,
      tien_funciones: form.funcionesForm,
      id_sucursal: form.idSucursalForm, 
      id_departamento: form.idDepartamentoForm
    };

    this.rest.CrearNuevoReloj(datosReloj).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Dispositivo registrado')
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Dispositivo no pudo ser registrado')
    });
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.nombreF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeErrorIp() {
    if (this.ipF.hasError('pattern')) {
      return 'Ingresar IP Ej: 0.0.0.0';
    }
    return this.ipF.hasError('required') ? 'Campo Obligatorio' : '';
  }
  
  ObtenerMensajeErrorPuerto() {
    if (this.puertoF.hasError('pattern')) {
      return 'Ingresar 4 números';
    }
    return this.puertoF.hasError('required') ? 'Campo Obligatorio' : '';
  }

  ObtenerMensajeErrorSerie() {
    if (this.serieF.hasError('pattern')) {
      return 'Ingresar tres números';
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

  CerrarVentanaRegistroReloj() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
