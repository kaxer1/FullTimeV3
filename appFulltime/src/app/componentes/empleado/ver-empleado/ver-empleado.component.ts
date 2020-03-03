import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})
export class VerEmpleadoComponent implements OnInit {

  empleadoUno: any = [];
  idEmpleado: string;
  fecha: any = [];

  constructor(
    public rest: EmpleadoService,
    public router: Router
    ) { 
    var cadena = this.router.url;
    var aux = cadena.split("/",);
    this.idEmpleado = aux[2];
    console.log(this.idEmpleado);
  }

  ngOnInit(): void {
    this.verEmpleado(this.idEmpleado);
  }

  onUploadFinish(event) {
    console.log(event);
  }

  verEmpleado(idemploy: any) {
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      var cadena1 = data[0]['fec_nacimiento'];
      var aux1 = cadena1.split("T");
      // console.log(aux1[0]);
      
      this.fecha = aux1[0];
      console.log(this.fecha);
      console.log(this.empleadoUno);
    })
  }

}
