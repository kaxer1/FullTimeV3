import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/servicios/roles/roles.service';

@Component({
  selector: 'app-visualizar-empleados',
  templateUrl: './visualizar-empleados.component.html',
  styleUrls: ['./visualizar-empleados.component.css']
})
export class VisualizarEmpleadosComponent implements OnInit {

  empleado: any = [];
  
  constructor(
    public rest: RolesService
  ) { }

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados(){
    this.empleado = [];
    this.rest.getEmpleadosRest().subscribe(data => {
      console.log(data);
      this.empleado = data
    })
  }


}
