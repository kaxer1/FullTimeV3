import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { RegistroProcesoComponent } from '../registro-proceso/registro-proceso.component';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-principal-proceso',
  templateUrl: './principal-proceso.component.html',
  styleUrls: ['./principal-proceso.component.css'],
  encapsulation: ViewEncapsulation.None
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
    private toastr: ToastrService,
    public vistaRegistrarProceso: MatDialog,
  ) { }

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];
  
  ngOnInit(): void {
    this.getProcesos();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
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
      this.procesos = data;
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