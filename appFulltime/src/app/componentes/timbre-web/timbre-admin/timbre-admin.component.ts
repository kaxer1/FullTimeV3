// IMPORTACIÓN DE LIBRERIAS
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// IMPORTACIÓN DE SERVICIOS
import { DatosGeneralesService } from 'src/app/servicios/datosGenerales/datos-generales.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { TimbresService } from 'src/app/servicios/timbres/timbres.service';

@Component({
  selector: 'app-timbre-admin',
  templateUrl: './timbre-admin.component.html',
  styleUrls: ['./timbre-admin.component.css']
})

export class TimbreAdminComponent implements OnInit {

  // VARIABLE DE ALMACENAMIENTO DE DATOS DE EMPLEADO
  datosEmpleado: any = [];

  // DATOS DEL FORMULARIO DE BÚSQUEDA
  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  departamentoF = new FormControl('', [Validators.minLength(2)]);
  cargoF = new FormControl('', [Validators.minLength(2)]);

  // DATOS DE FILTROS DE BÚSQUEDA
  filtroCodigo: number;
  filtroCedula: '';
  filtroEmpleado = '';
  filtroDepartamento: '';
  filtroCargo: '';

  // ITEMS DE PAGINACIÓN DE LA TABLA DE LISTA DE EMPLEADOS
  tamanio_pagina_e: number = 5;
  numero_pagina_e: number = 1;
  pageSizeOptions_e = [5, 10, 20, 50];

  // VARIABLES DE ALMACENAMIENTO DE DATOS DE TIMBRES
  timbres: any = [];
  lista: boolean = false

  // ITEMS DE PAGINACION DE LA TABLA TIMBRES
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // FILTROS DE BÚSQUEDA DE TIMBRES POR FECHA
  dataSource: any;
  filtroFechaTimbre = '';

  constructor(
    private validaciones: ValidacionesService,
    public restD: DatosGeneralesService,
    private restTimbres: TimbresService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.VerDatosEmpleado();
  }

  // EVENTO PARA MANEJAR LA PÁGINACIÓN DE TABLA DE EMPLEADOS
  ManejarPaginaE(e: PageEvent) {
    this.tamanio_pagina_e = e.pageSize;
    this.numero_pagina_e = e.pageIndex + 1;
  }

  // LISTA DE DATOS DE EMPLEADOS
  VerDatosEmpleado() {
    this.datosEmpleado = [];
    this.restD.ListarInformacionActual().subscribe(data => {
      this.datosEmpleado = data;
      console.log('datos_actuales', this.datosEmpleado)
    });
  }

  // EVENTO PARA MANEJAR LA PÁGINACIÓN DE TABLA DE TIMBRES
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // LISTAR DATOS DE TIMBRES SEGÚN CÓDIGO DE EMPLEADO
  selec_nombre: any;
  ObtenerListaTimbres(id: number, nombre: any, apellido: any) {
    this.restTimbres.ObtenerTimbresEmpleado(id).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.timbres);
      this.timbres = this.dataSource.data;
      this.lista = true;
      this.selec_nombre = nombre + ' ' + apellido;
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  // MÉTODO DE BÚSQUEDA DE DATOS DE ACUERDO A LA FECHA INGRESADA
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroFechaTimbre = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // MÉTODO PARA VER UBICACIÓN DE TIMBRE
  abrirMapa(latitud, longitud) {
    if (!latitud || !longitud) return this.toastr.warning('Timbre seleccionado no tiene registro de coordenadas de ubicación.')
    const rutaMapa = "https://www.google.com/maps/search/+" + latitud + "+" + longitud;
    window.open(rutaMapa);
  }

  // MÉTODO DE VALIDACIÓN DE INGRESO DE SOLO LETRAS
  IngresarSoloLetras(e) {
    return this.validaciones.IngresarSoloLetras(e)
  }

  // MÉTODO DE VALIDACIÓN DE INGRESO DE SOLO NÚMEROS
  IngresarSoloNumeros(evt) {
    return this.validaciones.IngresarSoloNumeros(evt)
  }

  // MÉTODO PARA LIMPIAR CAMPOS DE FORMULARIO
  LimpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.departamentoF.reset();
    this.cargoF.reset();
    this.filtroEmpleado = '';
  }

  // MÉTODO PARA CERRAR TABLA
  CerrarTabla() {
    this.lista = false;
    this.timbres = [];
  }
}
