import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { RegistroRolComponent } from 'src/app/componentes/catalogos/catRoles/registro-rol/registro-rol.component';
import { EditarRolComponent } from 'src/app/componentes/catalogos/catRoles/editar-rol/editar-rol.component';

@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class VistaRolesComponent implements OnInit {

  roles: any = [];
  filtroRoles = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  buscarDescripcion = new FormControl('', Validators.minLength(2));

  constructor(
    private rest: RolesService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    this.obtenerRoles();
  }

  ngOnInit() {
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
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

  obtenerRoles() {
    this.rest.getRoles().subscribe(res => {
      this.roles = res;
    },
      err => console.error(err)
    );
  }

  /*****************************************************************************
   * VENTANA PARA REGISTRAR Y EDITAR DATOS
   *****************************************************************************/

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarRolComponent, { width: '400px', data: { datosRol: datosSeleccionados, actualizar: true } }).disableClose = true;
  }

  AbrirVentanaRegistrarRol() {
    this.vistaRegistrarDatos.open(RegistroRolComponent, { width: '400px' }).disableClose = true;
  }

  limpiarCampoBuscar() {
    this.buscarDescripcion.reset();
  }
}
