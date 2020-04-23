import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';

@Component({
  selector: 'app-empl-cargos',
  templateUrl: './empl-cargos.component.html',
  styleUrls: ['./empl-cargos.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class EmplCargosComponent implements OnInit {

  idEmpleado: string;

  departamento: any = [];
  sucursales: any = [];
  empresas: any = [];

  idEmpleContrato = new FormControl('', [Validators.required]);
  idDepartamento = new FormControl('', [Validators.required]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);
  idSucursal = new FormControl('', [Validators.required]);
  sueldo = new FormControl('', [Validators.required]);
  horaTrabaja = new FormControl('', [Validators.required]);
  idEmpresaF = new FormControl('', Validators.required);

  public nuevoEmplCargosForm = new FormGroup({
    // idEmplContratoForm: this.idEmpleContrato,
    idDeparForm: this.idDepartamento,
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    idSucursalForm: this.idSucursal,
    sueldoForm: this.sueldo,
    horaTrabajaForm: this.horaTrabaja,
    idEmpresaForm: this.idEmpresaF,
  });

  constructor(
    private restCatDepartamento: DepartamentosService,
    private restEmplCargos: EmplCargosService,
    private restSucursales: SucursalService,
    private restE: EmpresaService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EmplCargosComponent>,
    public router: Router,
  ) {
    let cadena = this.router.url;
    let aux = cadena.split('/');
    this.idEmpleado = aux[2];
    console.log(this.idEmpleado);
  }

  ngOnInit(): void {
    this.limpiarCampos();
    this.BuscarEmpresas();
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

  limpiarCampos() {
    this.nuevoEmplCargosForm.reset();
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

  insertarEmpleadoCargo(form) {
    let dataEmpleadoCargo = {
      id_empl_contrato: 4,
      id_departamento: form.idDeparForm,
      fec_inicio: form.fecInicioForm, //"2020-03-26" 
      fec_final: form.fecFinalForm,
      id_sucursal: form.idSucursalForm,
      sueldo: form.sueldoForm,
      hora_trabaja: form.horaTrabajaForm
    }
    console.log(dataEmpleadoCargo);
    this.restEmplCargos.postEmpleadoCargosRest(dataEmpleadoCargo).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Cargo del empleado Guardado');
      this.limpiarCampos();
    });
  }

  CerrarVentanaRegistroCargo() {
    this.limpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }


}
