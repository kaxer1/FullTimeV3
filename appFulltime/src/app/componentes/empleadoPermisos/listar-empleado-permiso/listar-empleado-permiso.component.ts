import { Component, OnInit } from '@angular/core';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listar-empleado-permiso',
  templateUrl: './listar-empleado-permiso.component.html',
  styleUrls: ['./listar-empleado-permiso.component.css']
})
export class ListarEmpleadoPermisoComponent implements OnInit {

  permisos: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private restP: PermisosService,
  ) { }

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  obtenerPermisos(){
    this.restP.obtenerAllPermisos().subscribe(res => {
      this.permisos = res;
      console.log(res);
    });
  }


}
