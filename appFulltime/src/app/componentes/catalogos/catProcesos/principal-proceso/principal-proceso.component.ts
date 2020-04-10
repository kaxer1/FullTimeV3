import { Component, OnInit } from '@angular/core';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
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
  filtroProPadre = '';

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
      this.auxiliar1 = data;
      this.auxiliar1.forEach(element => {
        
        if(element.proc_padre != null){
          let vistaProceso = {
            id: element.proc_padre
          }
          this.auxiliar2.push(vistaProceso);
        }        
      });

      this.auxiliar1.forEach(obj => {
        let VistaProceso;
        
        if (obj.proc_padre == null){
          VistaProceso = {
            id: obj.id,
            nombre: obj.nombre,
            nivel: obj.nivel,
            proc_padre: 'ninguno'
          }
          this.procesos.push(VistaProceso);
        }

        this.auxiliar2.forEach(obj1 => {
          
          this.rest.getOneProcesoRest(obj1.id).subscribe(data => {
            if(obj1.id == obj.proc_padre){
              VistaProceso = {
                id: obj.id,
                nombre: obj.nombre,
                nivel: obj.nivel,
                proc_padre: data[0]['nombre']
              }
              this.procesos.push(VistaProceso);
            }
          });

        });
        
      });

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
    this.vistaRegistrarProceso.open(RegistroProcesoComponent, { width: '300px' }).disableClose = true;
  }
}
