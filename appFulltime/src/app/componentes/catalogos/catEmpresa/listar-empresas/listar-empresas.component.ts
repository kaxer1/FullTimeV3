import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { RegistroEmpresaComponent } from 'src/app/componentes/catalogos/catEmpresa/registro-empresa/registro-empresa.component';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';


@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.css']
})
export class ListarEmpresasComponent implements OnInit {

  buscarNombre = new FormControl('', [Validators.minLength(2)]);
  buscarRuc = new FormControl('', [Validators.minLength(2)]);
  filtroNomEmpresa = '';
  filtroRucEmpresa = '';

  public BuscarEmpresaForm = new FormGroup({
    buscarNombreForm: this.buscarNombre,
    buscarRucForm: this.buscarRuc
  });

  empresas: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: EmpresaService,
    private toastr: ToastrService,
    public vistaRegistrarEmpresa: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerEmpresa();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerEmpresa() {
    this.rest.ConsultarEmpresas().subscribe(data => {
      this.empresas = data;
    });
  }

  AbrirVentanaRegistrarEmpresa() {
    this.vistaRegistrarEmpresa.open(RegistroEmpresaComponent, { width: '600px' }).disableClose = true;
  }

  LimpiarCampoBuscar() {
    this.BuscarEmpresaForm.setValue({
      buscarNombreForm: '',
      buscarRucForm: ''
    });
    this.ObtenerEmpresa();
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
