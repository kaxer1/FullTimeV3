import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

import { RegistrarNivelTitulosComponent } from 'src/app/componentes/nivelTitulos/registrar-nivel-titulos/registrar-nivel-titulos.component'
import { EditarNivelTituloComponent } from 'src/app/componentes/nivelTitulos/editar-nivel-titulo/editar-nivel-titulo.component'

import { NivelTitulosService } from 'src/app/servicios/nivelTitulos/nivel-titulos.service';


@Component({
  selector: 'app-listar-nivel-titulos',
  templateUrl: './listar-nivel-titulos.component.html',
  styleUrls: ['./listar-nivel-titulos.component.css']
})
export class ListarNivelTitulosComponent implements OnInit {

  nivelTitulos: any = [];
  filtradoNombre = '';

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
 
  // Asignación de validaciones a inputs del formulario
  public BuscarNivelTitulosForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public vistaRegistrarDatos: MatDialog,
    public restNivelTitulos: NivelTitulosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerNiveles();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerNiveles() {
    this.nivelTitulos = [];
    this.restNivelTitulos.getNivelesTituloRest().subscribe(res => {
      this.nivelTitulos = res;
    });
  }

  AbrirVentanaNivelTitulo(): void {
    this.vistaRegistrarDatos.open(RegistrarNivelTitulosComponent, { width: '400px' }).disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarNivelTitulosForm.setValue({
      nombreForm: ''
    });
    this.ObtenerNiveles();
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombreF.hasError('pattern')) {
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

  AbrirVentanaEditarTitulo(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarNivelTituloComponent, { width: '400px', data: datosSeleccionados }).disableClose = true;
    //console.log(datosSeleccionados.fecha);
  }

}
