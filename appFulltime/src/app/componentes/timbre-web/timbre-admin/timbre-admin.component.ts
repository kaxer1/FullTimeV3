import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TimbresService } from 'src/app/servicios/timbres/timbres.service';
import { CrearTimbreComponent } from '../crear-timbre/crear-timbre.component';

@Component({
  selector: 'app-timbre-admin',
  templateUrl: './timbre-admin.component.html',
  styleUrls: ['./timbre-admin.component.css']
})
export class TimbreAdminComponent implements OnInit {

  Lista_empleados: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

   /**
   * Variables Tabla de datos
   */
  dataSource: any;  
  filtroEmpleados = '';

  constructor(
    private restTimbres: TimbresService,
    private toastr: ToastrService,
    private openView: MatDialog
  ) { }

  ngOnInit(): void {
    this.ObtenerEmpleados();
  }
  
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerEmpleados() {
    this.dataSource = new MatTableDataSource(JSON.parse(sessionStorage.getItem('lista-empleados')));
    this.Lista_empleados = this.dataSource.data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroEmpleados = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  RegistrarTibre(empleado) {
    this.openView.open(CrearTimbreComponent, {width: '400px', data: empleado}).afterClosed().subscribe(data => {
      console.log(data);
      if (!data.close) {
        this.restTimbres.PostTimbreWebAdmin(data).subscribe(res => {
          console.log(res);
          this.toastr.success(res.message)
        }, err => {
          console.log(err);
          this.toastr.error(err)
        })
      }
    })
  }

  
}
