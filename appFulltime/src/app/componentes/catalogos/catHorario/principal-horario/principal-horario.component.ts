import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { RegistroHorarioComponent } from 'src/app/componentes/catalogos/catHorario/registro-horario/registro-horario.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-principal-horario',
  templateUrl: './principal-horario.component.html',
  styleUrls: ['./principal-horario.component.css']
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
 
  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    public vistaRegistrarHorario: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerHorarios();
    this.nameFile = '';
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
    this.nameFile = 'Archivo seleccionado: ' + this.archivoSubido[0].name;
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
