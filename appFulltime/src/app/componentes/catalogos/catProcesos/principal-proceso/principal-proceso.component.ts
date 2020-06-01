import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { RegistroProcesoComponent } from '../registro-proceso/registro-proceso.component';
import { EditarCatProcesosComponent } from 'src/app/componentes/catalogos/catProcesos/editar-cat-procesos/editar-cat-procesos.component';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
import { EliminarProcesosComponent } from "../eliminar-procesos/eliminar-procesos.component";

@Component({
  selector: 'app-principal-proceso',
  templateUrl: './principal-proceso.component.html',
  styleUrls: ['./principal-proceso.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class PrincipalProcesoComponent implements OnInit {

  buscarNombre = new FormControl('', [Validators.minLength(2)]);
  buscarNivel = new FormControl('');
  buscarPadre = new FormControl('', [Validators.minLength(2)]);

  procesos: any = [];
  auxiliar1: any = [];
  auxiliar2: any = [];
  
  filtroNombre = '';
  filtroNivel: number;
  filtroProPadre = '';

  constructor(
    private rest: ProcesoService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
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
    this.vistaRegistrarDatos.open(RegistroProcesoComponent, { width: '450px' }).disableClose = true;
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarCatProcesosComponent, { width: '450px', data: {datosP: datosSeleccionados, lista: true }}).disableClose = true;
    //console.log(datosSeleccionados.fecha);
  }

  AbrirAlertaEliminarTitulo(dataObjDelete: any): void {
    this.vistaRegistrarDatos.open(EliminarProcesosComponent, { width: '350px', data: dataObjDelete}).disableClose = true;
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

}