import { Component, OnInit } from '@angular/core';

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
  contratoEmpleadoRegimen: any = [];
  contratoEmpleado: any = [];
  cont: number;

  constructor(
    public restTitulo: TituloService,
    public restEmpleado: EmpleadoService,
    public restCargo: EmplCargosService,

  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.obtenerContratoEmpleadoRegimen();
    this.obtenerCargoEmpleado(parseInt(this.idEmpleado));
  }

  /** Método para obtener el contrato de un empleado con su respectivo régimen laboral */
  idContratoEmpleado: number;
  obtenerContratoEmpleadoRegimen() {
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleadoRegimen = res;
    }, error => { console.log("") });
    this.restEmpleado.BuscarContratoIdEmpleado(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleado = res;
    }, error => { console.log("") });
  }

  /** Método para obtener los datos del cargo del empleado */
  cargoEmpleado: any = [];
  cargosTotalesEmpleado: any = [];
  obtenerCargoEmpleado(id_empleado: number) {
    this.cargoEmpleado = [];
    this.cargosTotalesEmpleado = [];
    this.restEmpleado.BuscarIDContrato(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      for (let i = 0; i <= this.idContrato.length - 1; i++) {
        console.log("idContratoProbandoJenny", this.idContrato[i].id);
        this.restCargo.getInfoCargoEmpleadoRest(this.idContrato[i]['id']).subscribe(datos => {
          this.cargoEmpleado = datos;
          console.log("jenny datos", this.cargoEmpleado)
          if (this.cargoEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.cargosTotalesEmpleado = datos
              this.cont++;
            }
            else {
              this.cargosTotalesEmpleado = this.cargosTotalesEmpleado.concat(datos);
              console.log("Datos Cargos " + i + '', this.cargosTotalesEmpleado)
            }
          }
        });
      }
    });
  }

}
