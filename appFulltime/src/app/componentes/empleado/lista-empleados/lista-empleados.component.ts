import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/servicios/roles/roles.service';

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {

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

  verEmpleado(id: any){
    this.rest.getOneEmpleadoRest(id).subscribe(data => {
      console.log(data);
    })
  }

}
