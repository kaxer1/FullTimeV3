import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { ToastrService } from 'ngx-toastr';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

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
  cargoF = new FormControl('', [Validators.required, Validators.minLength(3)]);

  public nuevoEmplCargosForm = new FormGroup({
    idDeparForm: this.idDepartamento,
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    idSucursalForm: this.idSucursal,
    sueldoForm: this.sueldo,
    horaTrabajaForm: this.horaTrabaja,
    idEmpresaForm: this.idEmpresaF,
    cargoForm: this.cargoF
  });

  constructor(
    private restCatDepartamento: DepartamentosService,
    private restEmplCargos: EmplCargosService,
    private restSucursales: SucursalService,
    private restE: EmpresaService,
    private restEmpleado: EmpleadoService,
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
      this.id_empl_contrato = this.cargo[0].id_empl_contrato;
      this.cargo.forEach(obj => {
        this.FiltrarSucursalesSet(obj.id_empresa);
        this.ObtenerDepartamentosSet(obj.id_sucursal);
        console.log(obj);
        this.nuevoEmplCargosForm.patchValue({
          idDeparForm: obj.id_departamento,
          fecInicioForm: obj.fec_inicio,
          fecFinalForm: obj.fec_final,
          idSucursalForm: obj.id_sucursal,
          sueldoForm: obj.sueldo.split('.')[0],
          horaTrabajaForm: obj.hora_trabaja,
          idEmpresaForm: obj.id_empresa,
          cargoForm: obj.cargo
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

  FiltrarSucursales(form?) {
    let idEmpre = form.idEmpresaForm
    this.sucursales = [];
    this.restSucursales.BuscarSucEmpresa(idEmpre).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('La Empresa seleccionada no tiene Sucursales registradas','', {
        timeOut: 6000,
      })
    })
  }

  ObtenerDepartamentos(form) {
    this.departamento = [];
    let idSucursal = form.idSucursalForm;
    this.restCatDepartamento.BuscarDepartamentoSucursal(idSucursal).subscribe(datos => {
      this.departamento = datos;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados','', {
        timeOut: 6000,
      })
    });
  }

  FiltrarSucursalesSet(id: number) {
    this.sucursales = [];
    this.restSucursales.BuscarSucEmpresa(id).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('La Empresa seleccionada no tiene Sucursales registradas','', {
        timeOut: 6000,
      })
    })
  }

  ObtenerDepartamentosSet(id: number) {
    this.departamento = [];
    this.restCatDepartamento.BuscarDepartamentoSucursal(id).subscribe(datos => {
      this.departamento = datos;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados','', {
        timeOut: 6000,
      })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  ValidarDatosRegistro(form) {
      console.log('id contrato', this.cargo[0].id_empl_contrato);
      let datosBusqueda = {
        id_contrato: this.id_empl_contrato
      }
      this.restEmpleado.BuscarFechaIdContrato(datosBusqueda).subscribe(response => {
        console.log('fecha', response[0].fec_ingreso.split('T')[0], ' ', Date.parse(form.fecInicioForm), Date.parse(response[0].fec_ingreso.split('T')[0]))
        if (Date.parse(response[0].fec_ingreso.split('T')[0]) < Date.parse(form.fecInicioForm)) {
          if (Date.parse(form.fecInicioForm) < Date.parse(form.fecFinalForm)) {
            this.ActualizarEmpleadoCargo(form);
          }
          else {
            this.toastr.info('La fecha de finalización de actividades debe ser posterior a la fecha de inicio de actividades','', {
              timeOut: 6000,
            })
          }
        }
        else {
          this.toastr.info('La fecha de inicio de actividades no puede ser anterior a la fecha de ingreso de contrato.','', {
            timeOut: 6000,
          });
        }
      }, error => { });

  }

  ActualizarEmpleadoCargo(form) {
    let dataEmpleadoCargo = {
      id_departamento: form.idDeparForm,
      fec_inicio: form.fecInicioForm,
      fec_final: form.fecFinalForm,
      id_sucursal: form.idSucursalForm,
      sueldo: form.sueldoForm,
      hora_trabaja: form.horaTrabajaForm,
      cargo: form.cargoForm
    }
    this.restEmplCargos.ActualizarContratoEmpleado(this.idSelectCargo, this.id_empl_contrato, dataEmpleadoCargo).subscribe(res => {
      this.verEmpleado.obtenerCargoEmpleado(parseInt(this.idEmploy));
      this.cancelar()
      this.toastr.success('Operación Exitosa', 'Cargo del empleado Actualizado', {
        timeOut: 6000,
      });
    });
  }

  cancelar() { this.verEmpleado.verCargoEdicion(true); }

  ObtenerMensajeErrorCargoRequerido() {
    if (this.cargoF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }
}
