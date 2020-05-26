import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { AutorizaDepartamentoService } from 'src/app/servicios/autorizaDepartamento/autoriza-departamento.service';

@Component({
  selector: 'app-registro-autorizacion-depa',
  templateUrl: './registro-autorizacion-depa.component.html',
  styleUrls: ['./registro-autorizacion-depa.component.css']
})
export class RegistroAutorizacionDepaComponent implements OnInit {

  departamento: any = [];
  sucursales: any = [];
  empresas: any = [];
  empleados: any = [];

  nombreEmpleadoF = new FormControl('', [Validators.required]);
  idEmpresaF = new FormControl('', Validators.required);
  idSucursal = new FormControl('', [Validators.required]);
  idDepartamento = new FormControl('', [Validators.required]);
  autorizarF = new FormControl('', [Validators.required]);

  public autorizarDepaForm = new FormGroup({
    nombreEmpleadoForm: this.nombreEmpleadoF,
    idSucursalForm: this.idSucursal,
    idEmpresaForm: this.idEmpresaF,
    idDeparForm: this.idDepartamento,
    autorizarForm: this.autorizarF,
  });

  constructor(
    private restCatDepartamento: DepartamentosService,
    private restAutoriza: AutorizaDepartamentoService,
    private restSucursales: SucursalService,
    private restE: EmpresaService,
    private rest: EmpleadoService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroAutorizacionDepaComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any,
  ) { }

  ngOnInit(): void {
    this.BuscarEmpresas();
    this.ObtenerEmpleados(this.datoEmpleado.idEmpleado);
  }

  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleados = data;
      console.log(this.empleados)
      this.autorizarDepaForm.patchValue({
        nombreEmpleadoForm: this.empleados[0].nombre + ' ' + this.empleados[0].apellido,
      })
    })
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

  LimpiarCampos() {
    this.autorizarDepaForm.reset();
  }

  InsertarAutorizacion(form) {
    let autorizarDepar = {
      id_departamento: form.idDeparForm,
      id_empl_cargo: this.datoEmpleado.idCargo,
      estado: form.autorizarForm
    }
    console.log(autorizarDepar);
    this.restAutoriza.IngresarAutorizaDepartamento(autorizarDepar).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Autoridad registrada');
      this.LimpiarCampos();
      this.ObtenerEmpleados(this.datoEmpleado.idEmpleado);
    });
  }

  CerrarVentanaAutorizar() {
    this.LimpiarCampos();
    this.dialogRef.close();
    //window.location.reload();
  }

}
