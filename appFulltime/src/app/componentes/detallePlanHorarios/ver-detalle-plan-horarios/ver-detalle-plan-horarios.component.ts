import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { RegistroDetallePlanHorarioComponent } from 'src/app/componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';

@Component({
  selector: 'app-ver-detalle-plan-horarios',
  templateUrl: './ver-detalle-plan-horarios.component.html',
  styleUrls: ['./ver-detalle-plan-horarios.component.css']
})
export class VerDetallePlanHorariosComponent implements OnInit {

  idPlanH: string;
  idEmpleado: string;
  datosPlanificacion: any = [];
  datosDetalle: any = [];

  // items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  nameFile: string;
  archivoSubido: Array<File>;

  archivo1Form = new FormControl('');

  constructor(
    public router: Router,
    private restDP: DetallePlanHorarioService,
    private restPH: PlanHorarioService,
    public vistaRegistrarDatos: MatDialog,
    private toastr: ToastrService,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    //console.log('idPlanificacion', aux[2]);
    //console.log('idEmpleado', aux[3]);
    this.idPlanH = aux[2];
    this.idEmpleado = aux[3];
  }

  ngOnInit(): void {
    this.BuscarDatosPlanHorario(this.idPlanH);
    this.ListarDetalles(this.idPlanH);
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  BuscarDatosPlanHorario(id_planificacion: any) {
    this.datosPlanificacion = [];
    this.restPH.ObtenerPlanHorarioPorId(id_planificacion).subscribe(data => {
      this.datosPlanificacion = data;
    })
  }

  ListarDetalles(id_planificacion: any) {
    this.datosDetalle = [];
    this.restDP.ObtenerPlanHoraDetallePorIdPlanHorario(id_planificacion).subscribe(datos => {
      this.datosDetalle = datos;
      for (let i = this.datosDetalle.length - 1; i >= 0; i--) {
        var cadena = this.datosDetalle[i]['tipo_dia'];
        if (cadena === 1) {
          this.datosDetalle[i]['tipo_dia'] = 'Libre';
        }
        else if (cadena === 2) {
          this.datosDetalle[i]['tipo_dia'] = 'Feriado';
        }
        else if (cadena === 3) {
          this.datosDetalle[i]['tipo_dia'] = 'Normal';
        }
      }
      console.log(this.datosDetalle)
    })
  }

  AbrirVentanaDetalles(datosSeleccionados): void {
    this.vistaRegistrarDatos.open(RegistroDetallePlanHorarioComponent, { width: '350px', data: { planHorario: datosSeleccionados, actualizarPage: true } })
      .afterClosed().subscribe(item => {
        this.ListarDetalles(this.idPlanH);
      });
  }

  /* AbrirVentanaEditar(datosSeleccionados: any): void {
     console.log(datosSeleccionados);
     this.vistaRegistrarDatos.open(EditarHorarioComponent, { width: '900px', data: { horario: datosSeleccionados, actualizar: true } }).disableClose = true;
   }*/

  /****************************************************************************************************** 
* PLANTILLA CARGAR SOLO HORARIOS
******************************************************************************************************/

  fileChangePlantilla(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 30);
    console.log('nombre', itemName);
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'detalle planificacion empleado') {
        this.plantillaDetalle();
      } else {
        this.toastr.error('Solo se acepta Platilla con nombre Detalle Planificacion Empleado', 'Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantillaDetalle() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
      console.log('ver', this.archivoSubido[i])
    }
    this.restDP.subirArchivoExcel( parseInt(this.idPlanH), formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.');
      this.ListarDetalles(this.idPlanH);
      this.archivo1Form.reset();
      this.nameFile = '';
     // window.location.reload();
    });
  }
}
