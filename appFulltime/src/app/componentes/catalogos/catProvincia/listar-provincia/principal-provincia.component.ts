import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProvinciaService } from '../../../../servicios/catalogos/catProvincias/provincia.service'
import { RegistroProvinciaComponent } from '../registro-provincia/registro-provincia.component'
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-principal-provincia',
  templateUrl: './principal-provincia.component.html',
  styleUrls: ['./principal-provincia.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PrincipalProvinciaComponent implements OnInit {

  // Almacenamiento de datos
  provincias: any = [];
  filtroPais = '';
  filtroProvincia = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Control de campos y validaciones del formulario
  paisF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  provinciaF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);

  // Asignación de validaciones a inputs del formulario
  public BuscarProvinciasForm = new FormGroup({
    paisForm: this.paisF,
    provinciaForm: this.provinciaF,
  });

  constructor(
    public rest: ProvinciaService,
    public vistaRegistrarProvincia: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ListarProvincias();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ListarProvincias() {
    this.provincias = [];
    this.rest.getProvinciasRest().subscribe(datos => {
      this.provincias = datos;
    })
  }

  AbrirVentanaRegistrarProvincia() {
    this.vistaRegistrarProvincia.open(RegistroProvinciaComponent, { width: '400px' }).disableClose = true;
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

  LimpiarCampos() {
    this.BuscarProvinciasForm.setValue({
      paisForm: '',
      provinciaForm: ''
    });
    this.ListarProvincias;
  }

  ObtenerMensajePaisLetras() {
    if (this.paisF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeProvinciaLetras() {
    if (this.provinciaF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

}
