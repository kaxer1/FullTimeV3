import { Component, OnInit, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';

import { RegistoEmpleadoHorarioComponent } from 'src/app/componentes/empleadoHorario/registo-empleado-horario/registo-empleado-horario.component';

@Component({
  selector: 'app-metodos',
  templateUrl: './metodos.component.html',
  styleUrls: ['./metodos.component.css']
})

@Injectable({
  providedIn: 'root'
}
)
export class MetodosComponent implements OnInit {

  constructor(
    public restCargo: EmplCargosService,
    public restEmpleHorario: EmpleadoHorariosService,
    public vistaRegistrarDatos: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  RegistrarHorarioEmpleado(id_empleado: number, idCargo: any = []): void {
    this.restCargo.BuscarIDCargoActual(id_empleado).subscribe(datos => {
      idCargo = datos;
      console.log("idcargo ", idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistoEmpleadoHorarioComponent,
        { width: '600px', data: { idEmpleado: id_empleado, idCargo: idCargo[0].max } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }
}
