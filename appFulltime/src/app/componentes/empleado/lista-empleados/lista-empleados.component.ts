import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {

  empleado: any = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cedula'];
  
  codigo = new FormControl('', Validators.required);
  cedula = new FormControl('', Validators.required);
  nombre = new FormControl('', Validators.required);
  apellido = new FormControl('', Validators.required);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombre: '';
  filtroApellido: '';

  constructor(
    public rest: EmpleadoService,
    public router: Router
  ) { 
  }

  ngOnInit(): void {
    this.getEmpleados();
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  getEmpleados(){
    this.empleado = [];
    this.rest.getEmpleadosRest().subscribe(data => {
      // console.log(data);
      this.empleado = data
    })
  }

  verEmpleado(id: any){
    this.empleado = []
    this.rest.getOneEmpleadoRest(id).subscribe(data => {
      this.empleado = data;
    })
  }

  limpiarCampos(){
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
  }
}
