import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';
import { RegimenComponent } from 'src/app/componentes/catalogos/catRegimen/regimen/regimen.component';
import { EditarRegimenComponent } from 'src/app/componentes/catalogos/catRegimen/editar-regimen/editar-regimen.component';


@Component({
  selector: 'app-listar-regimen',
  templateUrl: './listar-regimen.component.html',
  styleUrls: ['./listar-regimen.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class ListarRegimenComponent implements OnInit {

  // Control de campos y validaciones del formulario
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);

  // Asignación de validaciones a inputs del formulario
  public BuscarRegimenForm = new FormGroup({
    descripcionForm: this.descripcionF,
  });

  // Almacenamiento de datos consultados  
  regimen: any = [];
  filtroRegimenLaboral = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: RegimenService,
    public router: Router,
    public vistaRegistrarDatos: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerRegimen();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Lectura de datos
  ObtenerRegimen() {
    this.regimen = [];
    this.rest.ConsultarRegimen().subscribe(datos => {
      this.regimen = datos;
    })
  }

  LimpiarCampos() {
    this.BuscarRegimenForm.setValue({
      descripcionForm: '',
    });
    this.ObtenerRegimen();
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

  ObtenerMensajeNombreValido() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  /*************************************************************************************
   * VENTANAS PARA REGISTRAR Y EDITAR DATOS DE UN RÉGIMEN LABORAL
   ***********************************************************************************/

  /* Ventana para editar datos del régimen laboral seleccionado */
  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarRegimenComponent, { width: '900px', data: { datosRegimen: datosSeleccionados, actualizar: true } }).disableClose = true;
  }

  /** Ventana para registrar datos de un nuevo régimen laboral */
  AbrirVentanaRegistrarRegimen(): void {
    this.vistaRegistrarDatos.open(RegimenComponent, { width: '900px' }).disableClose = true;
  }
}
