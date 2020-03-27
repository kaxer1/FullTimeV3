import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { EmplCargosService } from 'src/app/servicios/empleado/empl-cargos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empl-cargos',
  templateUrl: './empl-cargos.component.html',
  styleUrls: ['./empl-cargos.component.css']
})
export class EmplCargosComponent implements OnInit {

  departamento: any = [];

  idEmpleContrato = new FormControl('', [Validators.required]);
  idDepartamento = new FormControl('', [Validators.required]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);
  idBaseHorario = new FormControl('', [Validators.required]);
  idSucursal = new FormControl('', [Validators.required]);
  sueldo = new FormControl('', [Validators.required]);
  horaTrabaja = new FormControl('', [Validators.required]);

  public nuevoEmplCargosForm = new FormGroup({
    // idEmplContratoForm: this.idEmpleContrato,
    idDeparForm: this.idDepartamento,
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    idBaseHorarioForm: this.idBaseHorario,
    idSucursalForm: this.idSucursal,
    sueldoForm: this.sueldo,
    horaTrabajaForm: this.horaTrabaja 
  });

  constructor(
    private restCatDepartamento: DepartamentosService,
    private restEmplCargos: EmplCargosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
    this.obtenerCatDepartamentos();
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

  insertarEmpleadoCargo(form){
    let dataEmpleadoCargo = {
      id_empl_contrato: 2, 
      id_departamento: form.idDeparForm, 
      fec_inicio: form.fecInicioForm, //"2020-03-26" 
      fec_final: form.fecFinalForm, 
      id_base_horario: form.idBaseHorarioForm, 
      id_sucursal: 1, 
      sueldo: form.sueldoForm, 
      hora_trabaja: form.horaTrabajaForm
    }
    console.log(dataEmpleadoCargo);

    this.restEmplCargos.postEmpleadoCargosRest(dataEmpleadoCargo).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Cargo del empleado Guardado');
    });
  }

}
