import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { TipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-listar-tipo-comidas',
  templateUrl: './listar-tipo-comidas.component.html',
  styleUrls: ['./listar-tipo-comidas.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListarTipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  // Almacenamiento de datos consultados  
  tipoComidas: any = [];
  filtroNombre = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: TipoComidasService,
    public router: Router,
    public vistaRegistrarTipoComida: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoComidas();
  }
  
  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Lectura de datos
  ObtenerTipoComidas() {
    this.tipoComidas = [];
    this.rest.ConsultarTipoComida().subscribe(datos => {
      this.tipoComidas = datos;
    })
  }

  AbrirVentanaRegistrarTipoComidas(): void {
    this.vistaRegistrarTipoComida.open(TipoComidasComponent, { width: '300px' }).disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarTipoComidaForm.setValue({
      nombreForm: '',
    });
    this.ObtenerTipoComidas();
  }

}
