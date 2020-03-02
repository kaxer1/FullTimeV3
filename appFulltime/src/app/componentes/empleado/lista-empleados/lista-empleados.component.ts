import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {

  empleado: any = [];
  
  constructor(
    public rest: EmpleadoService
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
