import { Component, OnInit, Input } from '@angular/core';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empl-cargos',
  templateUrl: './empl-cargos.component.html',
  styleUrls: ['./empl-cargos.component.css']
})
export class EmplCargosComponent implements OnInit {

  @Input() idContratoEmpleado: string;

  departamento: any = [];
  sucursales: any = [];

  idEmpleContrato = new FormControl('', [Validators.required]);
  idDepartamento = new FormControl('', [Validators.required]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);
  idSucursal = new FormControl('', [Validators.required]);
  sueldo = new FormControl('', [Validators.required]);
  horaTrabaja = new FormControl('', [Validators.required]);

  public nuevoEmplCargosForm = new FormGroup({
    // idEmplContratoForm: this.idEmpleContrato,
    idDeparForm: this.idDepartamento,
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    idSucursalForm: this.idSucursal,
    sueldoForm: this.sueldo,
    horaTrabajaForm: this.horaTrabaja 
  });

  constructor(
    private restCatDepartamento: DepartamentosService,
    private restEmplCargos: EmplCargosService,
    private restSucursales: SucursalService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EmplCargosComponent>,
    public router: Router,
  ) {
    let cadena = this.router.url;
    let aux = cadena.split('/');
    console.log(aux[2]);
   }

  ngOnInit(): void {
    this.limpiarCampos();
    this.obtenerCatDepartamentos();
    this.obtenerSucursales();
  }

  limpiarCampos(){
    this.nuevoEmplCargosForm.reset();
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  obtenerCatDepartamentos(){
    this.restCatDepartamento.ConsultarDepartamentos().subscribe(res => {
      this.departamento = res;
    })
  }

  obtenerSucursales(){
    this.restSucursales.getSucursalesRest().subscribe(data => {
      this.sucursales = data
    });
  }

  insertarEmpleadoCargo(form){
    let dataEmpleadoCargo = {
      id_empl_contrato: 2, 
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

  CerrarVentanaRegistroContrato() {
    this.limpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }


}
