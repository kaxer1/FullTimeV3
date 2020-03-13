import { Component, OnInit } from '@angular/core';
import { ProcesoService } from 'src/app/servicios/catalogos/proceso.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroProcesoComponent } from '../registro-proceso/registro-proceso.component';

@Component({
  selector: 'app-principal-proceso',
  templateUrl: './principal-proceso.component.html',
  styleUrls: ['./principal-proceso.component.css']
})
export class PrincipalProcesoComponent implements OnInit {

  procesos: any = [];
  constructor(
    private rest: ProcesoService,
    public vistaRegistrarProceso: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProcesos();
  }

  getProcesos() {
    this.procesos = [];
    this.rest.getProcesosRest().subscribe(data => {
      this.procesos = data
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
    this.vistaRegistrarProceso.open(RegistroProcesoComponent, { width: '300px' })
  }
}
