import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})
export class VerEmpleadoComponent implements OnInit {

  empleado: any = [];
  
  constructor(public rest: EmpleadoService) { }

  ngOnInit(): void {
    this.verEmpleado(17000009);
  }

  onUploadFinish(event) {
    console.log(event);
  }

  verEmpleado(id: any) {
    this.empleado = [];
    this.rest.getOneEmpleadoRest(id).subscribe(data => {
      console.log(data);
      this.empleado = data;
    })
  }

}
