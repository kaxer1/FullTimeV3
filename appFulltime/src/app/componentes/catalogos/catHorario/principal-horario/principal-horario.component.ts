import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { RegistroHorarioComponent } from 'src/app/componentes/catalogos/catHorario/registro-horario/registro-horario.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-principal-horario',
  templateUrl: './principal-horario.component.html',
  styleUrls: ['./principal-horario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrincipalHorarioComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  horarios: any = [];
  
  // filtros
  filtroNombreHorario = '';
  
  // Control de campos y validaciones del formulario
  nombreHorarioF = new FormControl('', [Validators.minLength(2)]);
  archivoForm = new FormControl('');
  
  // Asignación de validaciones a inputs del formulario
  public buscarHorarioForm = new FormGroup({
    nombreHorarioForm: this.nombreHorarioF,
  });
  
  nameFile: string;
  archivoSubido: Array < File > ;

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];
 
  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    public vistaRegistrarHorario: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerHorarios();
    this.nameFile = '';
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerHorarios() {
    this.horarios = [];
    this.rest.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
    })   
  }

  AbrirVentanaRegistrarHorario(): void {
    this.vistaRegistrarHorario.open(RegistroHorarioComponent, { width: '350px' }).disableClose = true;
  }

  LimpiarCampos() {
    this.buscarHorarioForm.setValue({
      nombreHorarioForm: '',
    });
    this.ObtenerHorarios();
  }

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    console.log(this.nameFile);
  }
  
  plantilla() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.subirArchivoExcel(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.');
      this.ObtenerHorarios();
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

}
