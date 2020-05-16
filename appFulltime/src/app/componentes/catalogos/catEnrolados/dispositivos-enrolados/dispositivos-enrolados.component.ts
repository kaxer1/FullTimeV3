import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { EnroladoService } from 'src/app/servicios/catalogos/catEnrolados/enrolado.service';
import { EnroladosRelojesService } from 'src/app/servicios/enroladosRelojes/enrolados-relojes.service';
import { EnroladoRelojComponent } from 'src/app/componentes/catalogos/catEnrolados/enrolado-reloj/enrolado-reloj.component';
import { EditarEnroladosComponent } from 'src/app/componentes/catalogos/catEnrolados/editar-enrolados/editar-enrolados.component';

@Component({
  selector: 'app-dispositivos-enrolados',
  templateUrl: './dispositivos-enrolados.component.html',
  styleUrls: ['./dispositivos-enrolados.component.css']
})
export class DispositivosEnroladosComponent implements OnInit {

  idEnrolado: string;
  datosEnrolado: any = [];
  datosDispositivos: any = [];
  hide = false;

  // items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public router: Router,
    private rest: EnroladoService,
    private restE: EnroladosRelojesService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    this.idEnrolado = aux[2];
  }

  ngOnInit(): void {
    this.BuscarDatosEnrolado(this.idEnrolado);
    this.ListarEnroladoDispositivo(this.idEnrolado);
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  BuscarDatosEnrolado(idEnrolado: any) {
    this.datosEnrolado = [];
    this.rest.ListarUnEnrolado(idEnrolado).subscribe(data => {
      this.datosEnrolado = data;
      console.log(this.datosEnrolado);
    })
  }

  ListarEnroladoDispositivo(idEnrolado: any) {
    this.datosDispositivos = [];
    this.restE.BuscarEnroladosReloj(idEnrolado).subscribe(datos => {
      this.datosDispositivos = datos;
      console.log(this.datosDispositivos)
    })
  }

  AbrirVentanaAsignarReloj(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EnroladoRelojComponent, { width: '600px', data: { datosEnrolado: datosSeleccionados, actualizar: true } }).disableClose = true;
    console.log(datosSeleccionados.nombre);
  }

    // Ventana para editar datos
    AbrirVentanaEditar(datosSeleccionados: any): void {
      console.log(datosSeleccionados);
      this.vistaRegistrarDatos.open(EditarEnroladosComponent, { width: '600px', data: { datosEnrolado: datosSeleccionados, actualizar: true} }).disableClose = true;
    }

}
