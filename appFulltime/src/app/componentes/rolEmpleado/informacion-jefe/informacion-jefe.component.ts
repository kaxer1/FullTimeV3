import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { AutorizaDepartamentoService } from 'src/app/servicios/autorizaDepartamento/autoriza-departamento.service';

@Component({
  selector: 'app-informacion-jefe',
  templateUrl: './informacion-jefe.component.html',
  styleUrls: ['./informacion-jefe.component.css']
})

export class InformacionJefeComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  departamento: any = [];
  idEmpleado: string;
  idCargo: any = [];
  autorizan: any = [];

  constructor(
    private rest: EmpleadoService,
    private restCargo: EmplCargosService,
    private restAuto: AutorizaDepartamentoService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.ObtenerNombreDepartamento();
  }

  ObtenerNombreDepartamento() {
    this.idCargo = [];
    this.departamento = [];
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      var datosEmpleado = {
        id_emple: parseInt(this.idEmpleado),
        id_cargo: this.idCargo[0].max
      }
      this.rest.BuscarDepartamentoEmpleado(datosEmpleado).subscribe(datos => {
        this.departamento = datos;
        this.ObtenerPersonasAutorizan(this.departamento[0].id_depar);
      })
    }, error => { });
  }

  ObtenerPersonasAutorizan(id: number) {
    this.autorizan = [];
    this.restAuto.BuscarEmpleadosAutorizan(id) .subscribe(datos => {
      this.autorizan = datos;
    }, error => { });
  }

}
