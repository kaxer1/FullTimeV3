import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { ToastrService } from 'ngx-toastr';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-editar-cargo',
  templateUrl: './editar-cargo.component.html',
  styleUrls: ['./editar-cargo.component.css']
})
export class EditarCargoComponent implements OnInit {

  @Input() idSelectCargo: number;
  @Input() idEmploy: string;

  cargo: any = [];
  departamento: any = [];
  sucursales: any = [];
  empresas: any = [];

  idDepartamento = new FormControl('', [Validators.required]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);
  idSucursal = new FormControl('', [Validators.required]);
  sueldo = new FormControl('', [Validators.required]);
  horaTrabaja = new FormControl('', [Validators.required]);
  idEmpresaF = new FormControl('', Validators.required);

  public nuevoEmplCargosForm = new FormGroup({
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
    private verEmpleado: VerEmpleadoComponent,
  ) { }

  ngOnInit(): void {
    this.obtenerCargoEmpleado();
    this.BuscarEmpresas();
  }

  id_empl_contrato: number;
  obtenerCargoEmpleado() {
    this.restEmplCargos.getUnCargoRest(this.idSelectCargo).subscribe(res => {
      this.cargo = res;
      this.id_empl_contrato =  this.cargo[0].id_empl_contrato;
      this.cargo.forEach(obj => {
        this.FiltrarSucursalesSet(obj.id_empresa);
        this.ObtenerDepartamentosSet(obj.id_sucursal);
        console.log(obj);
        this.nuevoEmplCargosForm.setValue({
          idDeparForm: obj.id_departamento,
          fecInicioForm: obj.fec_inicio,
          fecFinalForm: obj.fec_final,
          idSucursalForm: obj.id_sucursal,
          sueldoForm: obj.sueldo.split('.')[0],
          horaTrabajaForm: obj.hora_trabaja,
          idEmpresaForm: obj.id_empresa
        })
      });
    })
  }

  BuscarEmpresas() {
    this.empresas = [];
    this.restE.ConsultarEmpresas().subscribe(datos => {
      this.empresas = datos;
    })
  }

  FiltrarSucursales(form ?) {
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

  FiltrarSucursalesSet(id: number) {
    this.sucursales = [];
    this.restSucursales.BuscarSucEmpresa(id).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('La Empresa seleccionada no tiene Sucursales registradas')
    })
  }

  ObtenerDepartamentosSet(id: number) {
    this.departamento = [];
    this.restCatDepartamento.BuscarDepartamentoSucursal(id).subscribe(datos => {
      this.departamento = datos;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados')
    });
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

  ActualizarEmpleadoCargo(form) {
    let dataEmpleadoCargo = {
      id_departamento: form.idDeparForm,
      fec_inicio: form.fecInicioForm,  
      fec_final: form.fecFinalForm,
      id_sucursal: form.idSucursalForm,
      sueldo: form.sueldoForm,
      hora_trabaja: form.horaTrabajaForm
    }
    this.restEmplCargos.ActualizarContratoEmpleado(this.idSelectCargo, this.id_empl_contrato, dataEmpleadoCargo).subscribe(res => {
      this.verEmpleado.obtenerCargoEmpleado(parseInt(this.idEmploy));
      this.cancelar()
      this.toastr.success('Operación Exitosa', 'Cargo del empleado Actualizado');
    });
  }

  cancelar(){this.verEmpleado.verCargoEdicion(true);}


}
