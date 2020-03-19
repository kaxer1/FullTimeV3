import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { Router } from '@angular/router';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { TituloService } from 'src/app/servicios/catalogos/titulo.service';

@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})
export class VerEmpleadoComponent implements OnInit {

  empleadoUno: any = [];
  idEmpleado: string;
  fecha: any = [];
  mostrarDiscapacidad = true;
  mostrarTitulo = true;
  btnDisc = 'Añadir';
  btnTitulo = 'Añadir';
  discapacidadUser: any = [];
  tituloUser: any = [];

  btnHabilitado = true;
  barraDis = false;

  relacionTituloEmpleado: any = [];
  auxRestTitulo: any = [];

  constructor(
    public restEmpleado: EmpleadoService,
    public restDiscapacidad: DiscapacidadService,
    public restTitulo: TituloService,
    public router: Router
    ) { 
    var cadena = this.router.url;
    var aux = cadena.split("/",);
    this.idEmpleado = aux[2];
    this.obtenerTituloEmpleado(this.idEmpleado);
    this.obtenerDiscapacidadEmpleado(this.idEmpleado);
  }
  
  ngOnInit(): void {
    this.verEmpleado(this.idEmpleado);
  }

  onUploadFinish(event) {
    console.log(event);
  }

// metodo para ver la informacion del empleado 
  verEmpleado(idemploy: any) {
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      // sacar la fecha del JSON 
      var cadena1 = data[0]['fec_nacimiento'];
      var aux1 = cadena1.split("T");      
      this.fecha = aux1[0];
    })
  }

// metodo para obtener a los empleados que tengan alguna discapacidad asignada
  obtenerDiscapacidadEmpleado(idEmployDisca: any){
    this.restDiscapacidad.getDiscapacidadUsuarioRest(idEmployDisca).subscribe(data => {
      this.discapacidadUser = data;
      this.habilitarBtn();
    }, error => {});
  }

// metodo para obtener los titulos de un empleado a traves de la tabla EMPL_TITULOS que conecta a la tabla EMPLEADOS con CG_TITULOS 
  obtenerTituloEmpleado(idEmployTitu: any){
    this.relacionTituloEmpleado = [];

    this.restEmpleado.getEmpleadoTituloRest(idEmployTitu).subscribe(data => {

      this.tituloUser = data;
      let aux = {};
      for(let i of this.tituloUser){
        
        this.restTitulo.getOneTituloRest(i.id_titulo).subscribe(res => {
          this.auxRestTitulo = res;
          for(let j of this.auxRestTitulo){
            aux = {
              observaciones: i.observacion,
              nombre: j.nombre,
              nivel: j.nivel
            }
            this.relacionTituloEmpleado.push(aux);
          }
        });
      }

    }, error => {});
  }

// El metodo controla que solo se habilite el boton si no existe un registro de discapacidad, 
// caso contrario se deshabilita para que no permita mas registros de discapacidad al mismo usuario.
  habilitarBtn(){
    if(this.discapacidadUser.length == 0){
      this.btnHabilitado = true;
    } else {
      this.btnHabilitado = false;
      this.btnDisc = 'No puede añadir más';
      this.mostrarDiscapacidad = true;
    }
  }

// logica de boton para mostrar componente del registro de discapacidad
  mostrarDis(){
    if(this.mostrarDiscapacidad == true){
      this.mostrarDiscapacidad = false;
      this.btnDisc = 'No Añadir';
    } else {
      this.mostrarDiscapacidad = true;
      this.btnDisc = 'Añadir';
    }
  }

// logica de boton para mostrar componente del registro y asignacion de titulo al usuario.
  mostrarTit(){
    if(this.mostrarTitulo == true){
      this.mostrarTitulo = false;
      this.btnTitulo = 'No Añadir'
    } else {
      this.mostrarTitulo = true;
      this.btnTitulo = 'Añadir'
    }
  }
}
