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
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

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

  empleado: any = [];
  idEmpleado: number;

  constructor(
    private rest: HorarioService,
    public restE: EmpleadoService,
    private restD: DetalleCatHorariosService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerHorarios();
    this.nameFile = '';
    this.ObtenerEmpleados(this.idEmpleado);
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
      //this.urlImagen = 'http://localhost:3000/empleado/img/' + this.empleado[0]['imagen'];
    })
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
    this.vistaRegistrarDatos.open(RegistroHorarioComponent, { width: '900px' }).disableClose = true;
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

  AbrirVentanaEditarHorario(datosSeleccionados: any): void {
    this.vistaRegistrarDatos.open(EditarHorarioComponent, { width: '900px', data: { horario: datosSeleccionados, actualizar: false } }).disableClose = true;
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
    this.rest.CargarHorariosMultiples(formData).subscribe(res => {
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
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Usuario: ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

      footer: function (currentPage, pageCount, fecha) {
        var f = new Date();
        if (f.getMonth() < 10 && f.getDate() < 10) {
          fecha = f.getFullYear() + "-0" + [f.getMonth() + 1] + "-0" + f.getDate();
        } else if (f.getMonth() >= 10 && f.getDate() >= 10) {
          fecha = f.getFullYear() + "-" + [f.getMonth() + 1] + "-" + f.getDate();
        } else if (f.getMonth() < 10 && f.getDate() >= 10) {
          fecha = f.getFullYear() + "-0" + [f.getMonth() + 1] + "-" + f.getDate();
        } else if (f.getMonth() >= 10 && f.getDate() < 10) {
          fecha = f.getFullYear() + "-" + [f.getMonth() + 1] + "-0" + f.getDate();
        }
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha,
            {
              text: [
                {
                  text: '© ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', color: 'blue',
                  opacity: 0.5
                }
              ],
            }
          ],
          fontSize: 10,
          color: '#A4B8FF',
        }
      },
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
          fontSize: 12,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 10
        },
        itemsTableC: {
          fontSize: 10,
          alignment: 'center'
        }
      }
    };
  }

  presentarDataPDFEmpleados() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [30, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Minutos de almuerzo', style: 'tableHeader' },
                { text: 'Horas de trabajo', style: 'tableHeader' },
                { text: 'Horario Flexibe', style: 'tableHeader' },
                { text: 'Horario por horas', style: 'tableHeader' },
                { text: 'Documento', style: 'tableHeader' },
              ],
              ...this.horarios.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.min_almuerzo, style: 'itemsTableC' },
                  { text: obj.hora_trabajo, style: 'itemsTableC' },
                  { text: obj.flexible, style: 'itemsTableC' },
                  { text: obj.por_horas, style: 'itemsTableC' },
                  { text: obj.doc_nombre, style: 'itemsTableC' },
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
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

  /* ****************************************************************************************************
*                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
* ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloHorarios = [];
    this.horarios.forEach(obj => {
      objeto = {
        "horario": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "min_almuerzo": obj.min_almuerzo,
          "hora_trabajo": obj.hora_trabajo,
          "flexible": obj.flexible,
          "por_horas": obj.por_horas,
          "doc_nombre": obj.doc_nombre,
          "documento": obj.documento,
        }
      }
      arregloHorarios.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloHorarios).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://localhost:3000/horario/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

}
