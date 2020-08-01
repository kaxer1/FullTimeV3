import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { RelojesService } from 'src/app/servicios/catalogos/catRelojes/relojes.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';

@Component({
  selector: 'app-editar-reloj',
  templateUrl: './editar-reloj.component.html',
  styleUrls: ['./editar-reloj.component.css']
})

export class EditarRelojComponent implements OnInit {

  empresas: any = [];
  sucursales: any = [];
  departamento: any = [];
  nomDepartamento: any = [];
  datosReloj: any = [];
  idEmpresa: any = [];

  selec1 = false;
  selec2 = false;

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  ipF = new FormControl('', [Validators.required, Validators.pattern("[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}")]);
  puertoF = new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}')]);
  contraseniaF = new FormControl('', [Validators.minLength(4)]);
  marcaF = new FormControl('', [Validators.minLength(4)]);
  modeloF = new FormControl('', [Validators.minLength(3)]);
  serieF = new FormControl('', Validators.minLength(4));
  idFabricacionF = new FormControl('', [Validators.minLength(4)]);
  fabricanteF = new FormControl('', [Validators.minLength(4)]);
  funcionesF = new FormControl('', [Validators.required]);
  macF = new FormControl('');
  idEmpresaF = new FormControl('', Validators.required);
  idSucursalF = new FormControl('', Validators.required);
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
    idSucursalForm: this.idSucursalF,
    idDepartamentoForm: this.idDepartamentoF,
    idEmpresaForm: this.idEmpresaF,
  });

  constructor(
    private rest: RelojesService,
    private restCatDepartamento: DepartamentosService,
    private restSucursales: SucursalService,
    private restE: EmpresaService,
    private toastr: ToastrService,
    public router: Router,
    public dialogRef: MatDialogRef<EditarRelojComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.BuscarEmpresas();
    this.ImprimirDatos();
  }

  ImprimirDatos() {
    this.idEmpresa = [];
    this.restE.ConsultarUnaEmpresa(this.data.datosReloj.nomempresa).subscribe(datos => {
      this.idEmpresa = datos;
      this.BuscarDatos(this.idEmpresa[0].id);
      this.ObtenerDatos(this.idEmpresa[0].id);
    })
  }

  ObtenerDatos(id_empresa) {
    this.datosReloj = [];
    this.rest.ConsultarUnReloj(this.data.datosReloj.id).subscribe(datos => {
      this.datosReloj = datos;
      if (this.data.datosReloj.tien_funciones === true) {
        this.selec1 = true;
      }
      else {
        this.selec2 = true;
      }
      this.RelojesForm.patchValue({
        nombreForm: this.data.datosReloj.nombre,
        ipForm: this.data.datosReloj.ip,
        puertoForm: this.data.datosReloj.puerto,
        contraseniaForm: this.data.datosReloj.contrasenia,
        marcaForm: this.data.datosReloj.marca,
        modeloForm: this.data.datosReloj.modelo,
        serieForm: this.data.datosReloj.serie,
        idFabricacionForm: this.data.datosReloj.id_fabricacion,
        fabricanteForm: this.data.datosReloj.fabricante,
        macForm: this.data.datosReloj.mac,
        funcionesForm: this.data.datosReloj.tien_funciones,
        idSucursalForm: this.data.datosReloj.id_sucursal,
        idDepartamentoForm: this.data.datosReloj.id_departamento,
        idEmpresaForm: id_empresa,
      })
    })
  }

  /* *****************************************************************************
   *  CARGAR DATOS DE SELECCIÓN EMPRESA - SUCURSALES - DEPARTAMENTOS 
   * *****************************************************************************/
  BuscarDatos(id_empresa) {
    this.sucursales = [];
    this.restSucursales.BuscarSucEmpresa(id_empresa).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
    })
    this.departamento = [];
    this.restCatDepartamento.BuscarDepartamentoSucursal(this.data.datosReloj.id_sucursal).subscribe(datos => {
      this.departamento = datos;
    }, error => {
    });
  }

  BuscarEmpresas() {
    this.empresas = [];
    this.restE.ConsultarEmpresas().subscribe(datos => {
      this.empresas = datos;
    })
  }

  FiltrarSucursales(form) {
    let idEmpre = form.idEmpresaForm
    this.sucursales = [];
    this.restSucursales.BuscarSucEmpresa(idEmpre).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('La Empresa seleccionada no tiene Sucursales registradas')
    })
  }

  ObtenerDepartamentos(form) {
    this.departamento = [];
    let idSucursal = form.idSucursalForm;
    this.restCatDepartamento.BuscarDepartamentoSucursal(idSucursal).subscribe(datos => {
      this.departamento = datos;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados')
    });
  }

  ObtenerNombre(form) {
    this.nomDepartamento = [];
    this.restCatDepartamento.EncontrarUnDepartamento(form.idDepartamentoForm).subscribe(datos => {
      this.nomDepartamento = datos;
      console.log(this.nomDepartamento.nombre)
      if (this.nomDepartamento.nombre === 'Ninguno') {
        this.toastr.info('No ha seleccionado ningún departamento. Seleccione un departamento y continue con el registro')
      }
    }, error => {
      this.toastr.info('Descripción ingresada no coincide con los registros')
    });
  }

  InsertarReloj(form) {
    let datosReloj = {
      id: this.data.datosReloj.id,
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
    this.nomDepartamento = [];
    this.restCatDepartamento.EncontrarUnDepartamento(form.idDepartamentoForm).subscribe(datos => {
      this.nomDepartamento = datos;
      console.log(this.nomDepartamento.nombre)
      if (this.nomDepartamento.nombre === 'Ninguno') {
        this.toastr.info('No ha seleccionado ningún departamento. Seleccione un departamento y continue con el registro')
      }
      else {
        this.rest.ActualizarDispositivo(datosReloj).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Dispositivo actualizado')
          this.CerrarVentanaRegistroReloj();
          if (this.data.actualizar === true) {
            window.location.reload();
          } else {
            this.router.navigate(['/verDispositivos/', this.data.datosReloj.id]);
          }
        }, error => { });
      }
    }, error => { });
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
    //window.location.reload();
  }

}
