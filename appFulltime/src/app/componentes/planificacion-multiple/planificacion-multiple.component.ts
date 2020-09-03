import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as xlsx from 'xlsx';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';


@Component({
  selector: 'app-planificacion-multiple',
  templateUrl: './planificacion-multiple.component.html',
  styleUrls: ['./planificacion-multiple.component.css']
})
export class PlanificacionMultipleComponent implements OnInit {

  constructor(
    private rest: EmpleadoHorariosService,
    private restV: PeriodoVacacionesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  /* ***************************************************************************************************** 
   *                                  CARGAR HORARIOS DE EMPLEADOS CON PLANTILLA
   * *****************************************************************************************************/
  nameFileHorario: string;
  archivoSubidoHorario: Array<File>;
  archivoHorarioForm = new FormControl('');

  // PLANTILLA PERIODO DE VACACIONES
  nameFileVacacion: string;
  archivoSubidoVacacion: Array<File>;
  archivoVacacionForm = new FormControl('');


  fileChangeHorario(element) {
    this.archivoSubidoHorario = element.target.files;
    this.nameFileHorario = this.archivoSubidoHorario[0].name;
    let arrayItems = this.nameFileHorario.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 50);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() === 'planificacion multiple') {
        this.plantillaHorario();
      } else {
        this.toastr.error('Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantillaHorario() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoHorario.length; i++) {
      formData.append("uploads[]", this.archivoSubidoHorario[i], this.archivoSubidoHorario[i].name);
      console.log("toda la data", formData)
    }
    this.rest.CargaMultiple(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.');
      this.archivoHorarioForm.reset();
      this.nameFileHorario = '';
    });
  }


  // SUBIR PLANTILLA PERIODO DE VACACIONES
  fileChangeVacacion(element) {
    this.archivoSubidoVacacion = element.target.files;
    this.nameFileVacacion = this.archivoSubidoVacacion[0].name;
    let arrayItems = this.nameFileVacacion.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 18);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() === 'periodo vacaciones') {
        this.plantillaVacacion();
      } else {
        this.toastr.error('Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantillaVacacion() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoVacacion.length; i++) {
      formData.append("uploads[]", this.archivoSubidoVacacion[i], this.archivoSubidoVacacion[i].name);
      console.log("toda la data", formData)
    }
    this.restV.CargarPeriodosMultiples(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.');
      this.archivoVacacionForm.reset();
      this.nameFileVacacion = '';
    });
  }

}
