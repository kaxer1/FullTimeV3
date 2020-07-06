import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as xlsx from 'xlsx';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';


@Component({
  selector: 'app-planificacion-multiple',
  templateUrl: './planificacion-multiple.component.html',
  styleUrls: ['./planificacion-multiple.component.css']
})
export class PlanificacionMultipleComponent implements OnInit {

  constructor(
    private rest: EmpleadoHorariosService,
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

}
