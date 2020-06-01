import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditarTipoPermisosComponent } from '../../editar-tipo-permisos/editar-tipo-permisos.component';

@Component({
  selector: 'app-vista-elementos',
  templateUrl: './vista-elementos.component.html',
  styleUrls: ['./vista-elementos.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class VistaElementosComponent implements OnInit {

  tipoPermiso: any = [];
  filtroDescripcion = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoPermisoForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  constructor(
    private rest: TipoPermisosService,
    public vistaTipoPermiso: MatDialog
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoPermiso();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }
  
  ObtenerTipoPermiso() {
    this.rest.getTipoPermisoRest().subscribe(datos => {
      this.tipoPermiso = datos;
    }, error => {
    });
  }

  LimpiarCampos() {
    this.BuscarTipoPermisoForm.setValue({
      nombreForm: '',
    });
    this.ObtenerTipoPermiso();
  }

  AbrirVentanaEditarTipoPermisos(tipoPermiso: any): void {
    const DIALOG_REF = this.vistaTipoPermiso.open(EditarTipoPermisosComponent,
      { width: '900px', data: tipoPermiso });
      DIALOG_REF.disableClose = true;
  }

}
