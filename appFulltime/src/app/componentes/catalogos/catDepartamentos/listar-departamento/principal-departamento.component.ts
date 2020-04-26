import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { RegistroDepartamentoComponent } from 'src/app/componentes/catalogos/catDepartamentos/registro-departamento/registro-departamento.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-principal-departamento',
  templateUrl: './principal-departamento.component.html',
  styleUrls: ['./principal-departamento.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PrincipalDepartamentoComponent implements OnInit {

  // Almacenamiento de datos consultados y filtros de búsqueda
  filtroNombre = '';
  filtroNombreSuc = '';
  filtroEmpresaSuc = '';
  filtroDeparPadre = '';
  departamentos: any = [];

  // Control de campos y validaciones del formulario
  departamentoF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  departamentoPadreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  buscarNombre = new FormControl('', [Validators.minLength(2)]);
  buscarEmpresa = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarDepartamentosForm = new FormGroup({
    departamentoForm: this.departamentoF,
    departamentoPadreForm: this.departamentoPadreF,
  });
  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: DepartamentosService,
    private toastr: ToastrService,
    public vistaRegistrarDepartamento: MatDialog
  ) { }

  ngOnInit(): void {
    this.ListaDepartamentos();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  ListaDepartamentos() {
    this.departamentos = []
    this.rest.ConsultarDepartamentos().subscribe(datos => {
      this.departamentos = datos
    })
  }

  AbrirVentanaRegistrarDepartamento(): void {
    this.vistaRegistrarDepartamento.open(RegistroDepartamentoComponent, { width: '600px' }).disableClose = true;
  }

  AbrirVentanaEditarDepartamento(departamento: any): void {
    const DIALOG_REF = this.vistaRegistrarDepartamento.open(RegistroDepartamentoComponent,
      { width: '300px', data: departamento });
      DIALOG_REF.disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarDepartamentosForm.setValue({
      departamentoForm: '',
      departamentoPadreForm: ''
    });
    this.ListaDepartamentos();
    
  }

  ObtenerMensajeDepartamentoLetras() {
    if (this.departamentoF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeDepartamentoPadreLetras() {
    if (this.departamentoPadreF.hasError('pattern')) {
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


