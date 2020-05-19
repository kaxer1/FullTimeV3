import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { RegistrarSucursalesComponent } from '../registrar-sucursales/registrar-sucursales.component';
import { EditarSucursalComponent } from 'src/app/componentes/sucursales/editar-sucursal/editar-sucursal.component';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';

@Component({
  selector: 'app-lista-sucursales',
  templateUrl: './lista-sucursales.component.html',
  styleUrls: ['./lista-sucursales.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class ListaSucursalesComponent implements OnInit {

  buscarNombre = new FormControl('',[Validators.minLength(2)]);
  buscarCiudad = new FormControl('',[Validators.minLength(2)]);
  buscarEmpresa = new FormControl('', [Validators.minLength(2)]);
  filtroNombreSuc = '';
  filtroCiudadSuc = '';
  filtroEmpresaSuc = '';

  public BuscarSucursalForm = new FormGroup({
    buscarNombreForm: this.buscarNombre,
    buscarCiudadForm: this.buscarCiudad,
    buscarEmpresForm: this.buscarEmpresa
  });

  sucursales: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: SucursalService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerSucursal();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerSucursal(){
    this.rest.getSucursalesRest().subscribe(data => {
      this.sucursales = data;
    });
  }

  AbrirVentanaRegistrarSucursal(){
    this.vistaRegistrarDatos.open(RegistrarSucursalesComponent, { width: '900px' }).disableClose = true;
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarSucursalComponent, { width: '900px', data: datosSeleccionados }).disableClose = true;
    //console.log(datosSeleccionados.fecha);
  }

  LimpiarCampoBuscar(){
    this.BuscarSucursalForm.setValue({
      buscarNombreForm: '',
      buscarCiudadForm: '',
      buscarEmpresForm: ''
    });
    this.ObtenerSucursal();
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

}
