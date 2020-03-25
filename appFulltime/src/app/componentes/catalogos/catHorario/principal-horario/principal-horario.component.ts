import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { RegistroHorarioComponent } from 'src/app/componentes/catalogos/catHorario/registro-horario/registro-horario.component';

@Component({
  selector: 'app-principal-horario',
  templateUrl: './principal-horario.component.html',
  styleUrls: ['./principal-horario.component.css']
})
export class PrincipalHorarioComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  horarios: any = [];
  filtroNombreHorario = '';

   // Control de campos y validaciones del formulario
   nombreHorarioF = new FormControl('', [Validators.minLength(2)]);

   // Asignación de validaciones a inputs del formulario
   public buscarHorarioForm = new FormGroup({
    nombreHorarioForm: this.nombreHorarioF,
   });
 
  constructor(
    private rest: HorarioService,
    public vistaRegistrarHorario: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerHorarios();
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
}
