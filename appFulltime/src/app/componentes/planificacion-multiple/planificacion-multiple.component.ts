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

  /* ***************************************************************************************************** 
   *                                        PLANTILLA VACIA DE HORARIOS EMPLEADOS
   * *****************************************************************************************************/
  DescargarPlantillaPlanificacion() {
    var datosHorario = [{
      nombre: 'Eliminar esta Fila: Jenny Patricia',
      apellido: 'Tipan Villegas',
      cedula: '1785632145 Nota: formato de celda tipo Text',
      fec_inicio: '05/04/2020 Nota: Inicio de actividades /formato de celda tipo Text',
      fec_final: '05/05/2020 Nota: Fin de actividades / formato de celda tipo Text',
      lunes: ' true o false Nota: Indicar días libres',
      martes: 'true o false',
      miercoles: 'true o false',
      jueves: 'true o false',
      viernes: 'true o false',
      sabado: 'true o false',
      domingo: 'true o false',
      nom_horario: 'horario1',
      estado: '1-Activo/2-Inactivo/3-Suspendido'
    }];
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datosHorario);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'Empleado Horario');
    xlsx.writeFile(wb, "Planificacion Multiple" + '.xlsx');
  }

}
