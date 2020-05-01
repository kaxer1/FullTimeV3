import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { RelojesService } from 'src/app/servicios/catalogos/catRelojes/relojes.service';
import { RelojesComponent } from 'src/app/componentes/catalogos/catRelojes/relojes/relojes.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listar-relojes',
  templateUrl: './listar-relojes.component.html',
  styleUrls: ['./listar-relojes.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class ListarRelojesComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  filtroNombreReloj = '';
  filtroModeloReloj = '';
  filtroIpReloj = '';
  filtroEmpresaReloj = '';
  filtroSucursalReloj = '';
  filtroDepartamentoReloj = '';
  relojes: any = [];

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);
  empresaF = new FormControl('', [Validators.minLength(2)]);
  sucursalF = new FormControl('', [Validators.minLength(2)]);
  departamentoF = new FormControl('', [Validators.minLength(2)]);
  ipF = new FormControl('');
  modeloF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarRelojesForm = new FormGroup({
    nombreForm: this.nombreF,
    ipForm: this.ipF,
    modeloForm: this.modeloF,
    empresaForm: this.empresaF,
    sucursalForm: this.sucursalF,
    departamentoForm: this.departamentoF
  });

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: RelojesService,
    public router: Router,
    public vistaRegistrarRelojes: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerReloj();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerReloj() {
    this.relojes = [];
    this.rest.ConsultarRelojes().subscribe(datos => {
      this.relojes = datos;
    })
  }

  IngresarIp(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 46) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  AbrirVentanaRegistrarReloj(): void {
    this.vistaRegistrarRelojes.open(RelojesComponent, { width: '1200px' }).disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarRelojesForm.setValue({
      nombreForm: '',
      ipForm: '',
      modeloForm: '',
      empresaForm: '',
      sucursalForm: '',
      departamentoForm: ''
    });
    this.ObtenerReloj();
  }

}
