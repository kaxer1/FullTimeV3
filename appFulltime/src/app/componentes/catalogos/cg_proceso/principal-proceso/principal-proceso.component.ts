import { Component, OnInit } from '@angular/core';
import { ProcesoService } from 'src/app/servicios/catalogos/proceso.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroProcesoComponent } from '../registro-proceso/registro-proceso.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-principal-proceso',
  templateUrl: './principal-proceso.component.html',
  styleUrls: ['./principal-proceso.component.css']
})
export class PrincipalProcesoComponent implements OnInit {

  buscarNombre = new FormControl('', Validators.required);
  buscarNivel = new FormControl('', Validators.required);
  buscarPadre = new FormControl('', Validators.required);

  procesos: any = [];
  auxiliar1: any = [];
  auxiliar2: any = [];
  
  filtroNombre = '';
  filtroNivel: number;
  filtroProPadre: number;

  constructor(
    private rest: ProcesoService,
    public vistaRegistrarProceso: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProcesos();
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  limpiarCampoBuscar(){
    this.buscarNombre.reset();
    this.buscarNivel.reset();
    this.buscarPadre.reset();
  }

  getProcesos() {
    this.auxiliar1 = [];
    this.rest.getProcesosRest().subscribe(data => {
      this.procesos = data
      // this.auxiliar1 = data;
      // this.auxiliar1.forEach(element => {
        
      //   if(element.proc_padre > 0){
      //     let vistaProceso = {
      //       id: element.proc_padre,
      //       nombre: element.nombre
      //     }
      //     this.auxiliar2.push(vistaProceso);
      //   }
        
      // });
      // console.log(this.auxiliar1);
      // console.log(this.auxiliar2);

      // this.auxiliar1.forEach(obj => {
      //   let VistaProceso;
      //   if (obj.proc_padre == 0){
      //     VistaProceso = {
      //       id: obj.id,
      //       nombre: obj.nombre,
      //       nivel: obj.nivel,
      //       proc_padre: 'niguno'
      //     }
      //     this.procesos.push(VistaProceso);
      //   }

      //   this.auxiliar2.forEach(obj1 => {
      //     if(obj.proc_padre == obj1.id){
      //       VistaProceso = {
      //         id: obj.id,
      //         nombre: obj.nombre,
      //         nivel: obj.nivel,
      //         proc_padre: obj1.nombre
      //       }
      //       this.procesos.push(VistaProceso);
      //     }
      //   });
      // });
      console.log(this.procesos);

    });
  }

  getOneProvincia(id: number) {
    this.rest.getOneProcesoRest(id).subscribe(data => {
      this.procesos = data;
    })
  }

  postProvincia(form) {
    let dataProvincia = {
      nombre: form.nombre
    };

    this.rest.postProcesoRest(dataProvincia).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  AbrirVentanaRegistrarProceso(){
    this.vistaRegistrarProceso.open(RegistroProcesoComponent, { width: '300px' });
  }
}
