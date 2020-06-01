import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';

import { RegistroHorarioComponent } from 'src/app/componentes/catalogos/catHorario/registro-horario/registro-horario.component';
import { DetalleCatHorarioComponent } from 'src/app/componentes/catalogos/catHorario/detalle-cat-horario/detalle-cat-horario.component';
import { EditarHorarioComponent } from '../editar-horario/editar-horario.component';

@Component({
  selector: 'app-principal-horario',
  templateUrl: './principal-horario.component.html',
  styleUrls: ['./principal-horario.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class PrincipalHorarioComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  horarios: any = [];

  // filtros
  filtroNombreHorario = '';

  // Control de campos y validaciones del formulario
  nombreHorarioF = new FormControl('', [Validators.minLength(2)]);
  archivo1Form = new FormControl('');
  archivo2Form = new FormControl('');
  archivo3Form = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public buscarHorarioForm = new FormGroup({
    nombreHorarioForm: this.nombreHorarioF,
  });

  nameFile: string;
  archivoSubido: Array<File>;

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: HorarioService,
    private restD: DetalleCatHorariosService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerHorarios();
    this.nameFile = '';
  }

  ManejarPagina(e: PageEvent) {
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
    this.vistaRegistrarDatos.open(RegistroHorarioComponent, { width: '600px' }).disableClose = true;
  }

  AbrirRegistraDetalle(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(DetalleCatHorarioComponent, { width: '600px', data: { datosHorario: datosSeleccionados, actualizar: false } }).disableClose = true;
    console.log(datosSeleccionados.fecha);
  }

  LimpiarCampos() {
    this.buscarHorarioForm.setValue({
      nombreHorarioForm: '',
    });
    this.ObtenerHorarios();
  }

  AbrirVentanaEditarHorario(horario: any): void {
    const DIALOG_REF = this.vistaRegistrarDatos.open(EditarHorarioComponent,
      { width: '600px', data: horario });
      DIALOG_REF.disableClose = true;
  }

  /****************************************************************************************************** 
   * PLANTILLA CARGAR SOLO HORARIOS
   ******************************************************************************************************/

  fileChangeCatalogoHorario(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 50);
    console.log("funcion horario", itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'catalogo horarios') {
        this.plantillaHorario();
      } else {
        this.toastr.error('Solo se acepta', 'Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantillaHorario() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.subirArchivoExcel(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.');
      this.ObtenerHorarios();
      this.archivo1Form.reset();
      this.nameFile = '';
      window.location.reload();
    });
  }

  /* ***************************************************************************************************** 
   * PLANTILLA CARGAR SOLO DETALLES
   * *****************************************************************************************************/
  nameFileDetalle: string;
  archivoSubidoDetalle: Array<File>;
  fileChangeDetalle(element) {
    this.archivoSubidoDetalle = element.target.files;
    this.nameFileDetalle = this.archivoSubidoDetalle[0].name;
    let arrayItems = this.nameFileDetalle.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 50);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'detalles horarios') {
        this.plantillaDetalle();
      } else {
        this.toastr.error('Solo se acepta', 'Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantillaDetalle() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoDetalle.length; i++) {
      formData.append("uploads[]", this.archivoSubidoDetalle[i], this.archivoSubidoDetalle[i].name);
    }
    this.restD.subirArchivoExcel(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Detalle de Horario importada.');
      this.archivo2Form.reset();
      this.nameFileDetalle = '';
    });
  }

  /* ***************************************************************************************************** 
   * PLANTILLA CARGAR SOLO DETALLES
   * *****************************************************************************************************/
  nameFileHorarioDetalle: string;
  archivoSubidoDetalleHorario: Array<File>;
  fileChangeDetalleHorario(element) {
    this.archivoSubidoDetalleHorario = element.target.files;
    this.nameFileHorarioDetalle = this.archivoSubidoDetalleHorario[0].name;
    let arrayItems = this.nameFileHorarioDetalle.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 50);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'horarios y detalles') {
        this.plantillaDetalleHorario();
      } else {
        this.toastr.error('Solo se acepta', 'Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantillaDetalleHorario() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoDetalleHorario.length; i++) {
      formData.append("uploads[]", this.archivoSubidoDetalleHorario[i], this.archivoSubidoDetalleHorario[i].name);
    }
    this.rest.CargarHorariosDetalles(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horarios importada.');
      this.archivo3Form.reset();
      this.nameFileHorarioDetalle = '';
      window.location.reload();
    });
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A PDF 
   ******************************************************************************************************/

  generarPdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinicion();

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion() {
    sessionStorage.setItem('Empleados', this.horarios);
    return {
      pageOrientation: 'landscape',
      content: [
        {
          text: 'Horarios',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFEmpleados(),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        name: {
          fontSize: 16,
          bold: true
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 8
        }
      }
    };
  }

  presentarDataPDFEmpleados() {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Id', style: 'tableHeader' },
            { text: 'Nombre', style: 'tableHeader' },
            { text: 'Minutos de almuerzo', style: 'tableHeader' },
            { text: 'Horas de trabajo', style: 'tableHeader' },
            { text: 'Horario Flexibe', style: 'tableHeader' },
            { text: 'Horario por horas', style: 'tableHeader' },
          ],
          ...this.horarios.map(obj => {
            return [
              { text: obj.id, style: 'itemsTable' },
              { text: obj.nombre, style: 'itemsTable' },
              { text: obj.min_almuerzo, style: 'itemsTable' },
              { text: obj.hora_trabajo, style: 'itemsTable' },
              { text: obj.flexible, style: 'itemsTable' },
              { text: obj.por_horas, style: 'itemsTable' },
            ];
          })
        ]
      }
    };
  }


  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A EXCEL 
   ******************************************************************************************************/

  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.horarios);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'horarios');
    xlsx.writeFile(wb, "CatHorariosEXCEL" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.horarios);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "CatHorarioCSV" + new Date().getTime() + '.csv');
  }

}
