import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';


@Component({
  selector: 'app-contrato-cargo-empleado',
  templateUrl: './contrato-cargo-empleado.component.html',
  styleUrls: ['./contrato-cargo-empleado.component.css']
})

export class ContratoCargoEmpleadoComponent implements OnInit {

  idEmpleado: string;
  idContrato: any = [];
  contratoEmpleado: any = [];

  constructor(
    public restTitulo: TituloService,
    public restEmpleado: EmpleadoService,
    public restCargo: EmplCargosService,
    private toastr: ToastrService,

  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.obtenerContratoEmpleadoRegimen();
    this.obtenerCargoEmpleado(parseInt(this.idEmpleado));
    this.obtenerContratosEmpleado();
  }

  /** Método para obtener el Contrato Actual de un empleado con su respectivo régimen laboral */
  idContratoEmpleado: number;
  obtenerContratoEmpleadoRegimen() {
    this.restEmpleado.BuscarIDContratoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      this.restEmpleado.BuscarDatosContrato(this.idContrato[0].max).subscribe(res => {
        this.contratoEmpleado = res;
      }, error => { });
    }, error => { });
  }

  /** Método para ver lista de todos los contratos*/
  contratoBuscado: any = [];
  obtenerContratosEmpleado() {
    this.contratoBuscado = [];
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoBuscado = res;
    }, error => { });
  }

  /** Método para ver datos del contrato seleccionado */
  fechaContrato = new FormControl('');
  public contratoForm = new FormGroup({
    fechaContratoForm: this.fechaContrato,
  });
  contratoSeleccionado: any = [];
  listaCargos: any = [];
  obtenerContratoSeleccionado(form) {
    this.LimpiarCargo();
    this.contratoSeleccionado = [];
    this.restEmpleado.BuscarDatosContrato(form.fechaContratoForm).subscribe(res => {
      this.contratoSeleccionado = res;
    }, error => { });
    this.restCargo.getInfoCargoEmpleadoRest(form.fechaContratoForm).subscribe(datos => {
      this.listaCargos = datos;
    }, error => {
      this.toastr.info('El contrato seleccionado no registra ningún cargo', 'VERIFICAR');
    });
  }

  /** Método para limpiar registro Cargo y Contrato seleccionado*/
  LimpiarContrato() {
    this.contratoForm.reset();
    this.cargoForm.reset();
    this.contratoSeleccionado = [];
    this.listaCargos = [];
    this.cargoSeleccionado = [];
  }

  /** Método para obtener los datos del cargo del empleado */
  cargoEmpleado: any = [];
  cargosTotalesEmpleado: any = [];
  obtenerCargoEmpleado(id_empleado: number) {
    this.cargoEmpleado = [];
    this.cargosTotalesEmpleado = [];
    this.restEmpleado.BuscarIDContratoActual(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      this.restCargo.getInfoCargoEmpleadoRest(this.idContrato[0].max).subscribe(datos => {
        this.cargosTotalesEmpleado = datos;
        let cargoIdActual = this.cargosTotalesEmpleado[this.cargosTotalesEmpleado.length - 1].id;
        this.restCargo.getUnCargoRest(cargoIdActual).subscribe(datos => {
          this.cargoEmpleado = datos;
        }, error => { });
      }, error => {
        this.toastr.info('Debe registrar un cargo para el nuevo contrato registrado', 'REVISAR CARGO');
      });
    });
  }

  /** Método para limpiar registro del Cargo seleccionado*/
  LimpiarCargo() {
    this.cargoForm.reset();
    this.listaCargos = [];
    this.cargoSeleccionado = [];
  }

  /** Método para ver cargo seleccionado */
  fechaICargo = new FormControl('');
  public cargoForm = new FormGroup({
    fechaICargoForm: this.fechaICargo,
  });
  cargoSeleccionado: any = [];
  obtenerCargoSeleccionadoEmpleado(form) {
    this.cargoSeleccionado = [];
    this.restCargo.getUnCargoRest(form.fechaICargoForm).subscribe(datos => {
      this.cargoSeleccionado = datos;
    }, error => { });
  }

}