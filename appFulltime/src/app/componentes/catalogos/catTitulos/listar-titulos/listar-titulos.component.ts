import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TitulosComponent } from '../titulos/titulos.component'
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { NivelTitulosService } from 'src/app/servicios/nivelTitulos/nivel-titulos.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listar-titulos',
  templateUrl: './listar-titulos.component.html',
  styleUrls: ['./listar-titulos.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class ListarTitulosComponent implements OnInit {

  verTitulos: any = [];
  filtradoNombre = '';
  filtradoNivel = '';

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  nivelF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTitulosForm = new FormGroup({
    nombreForm: this.nombreF,
    nivelForm: this.nivelF,
  });

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public vistaRegistrarTitulo: MatDialog,
    public rest: TituloService,
    public restNivelTitulos: NivelTitulosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerTitulos();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerTitulos() {
    this.rest.getTituloRest().subscribe(data => {
      this.verTitulos = data;
    });
  }

  AbrirVentanaRegistrarTitulo(): void {
    this.vistaRegistrarTitulo.open(TitulosComponent, { width: '400px' }).disableClose = true;
  }

  LimpiarCampos() {
    console.log('limpiar');
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombreF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeErrorNivel() {
    if (this.nivelF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
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
