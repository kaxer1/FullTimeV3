import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { EditarTipoPermisosComponent } from '../../editar-tipo-permisos/editar-tipo-permisos.component';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-vista-elementos',
  templateUrl: './vista-elementos.component.html',
  styleUrls: ['./vista-elementos.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class VistaElementosComponent implements OnInit {

  tipoPermiso: any = [];
  filtroDescripcion = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleado: any = [];
  idEmpleado: number;

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoPermisoForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  constructor(
    private rest: TipoPermisosService,
    public restE: EmpleadoService,
    public vistaTipoPermiso: MatDialog
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerTipoPermiso();
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

  ObtenerTipoPermiso() {
    this.rest.getTipoPermisoRest().subscribe(datos => {
      this.tipoPermiso = datos;
      console.log(this.tipoPermiso);
    }, error => {
    });
  }

  LimpiarCampos() {
    this.BuscarTipoPermisoForm.setValue({
      nombreForm: '',
    });
    this.ObtenerTipoPermiso();
  }

  AbrirVentanaEditarTipoPermisos(tipoPermiso: any): void {
    const DIALOG_REF = this.vistaTipoPermiso.open(EditarTipoPermisosComponent,
      { width: '900px', data: tipoPermiso });
    DIALOG_REF.disableClose = true;
  }

  /****************************************************************************************************** 
 *                                         MÉTODO PARA EXPORTAR A PDF
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
    sessionStorage.setItem('TipoPermisos', this.tipoPermiso);
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
          text: 'Lista de Tipos de Permisos',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFTipoPermisos(),
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
          fontSize: 9,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 8,
          alignment: 'center',
        }
      }
    };
  }

  DescuentoSelect: any = ['Vacaciones', 'Ninguno'];
  AccesoEmpleadoSelect: any = ['Si', 'No'];
  presentarDataPDFTipoPermisos() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Permiso', style: 'tableHeader' },
                { text: 'Días de permiso', style: 'tableHeader' },
                { text: 'Horas de permiso', style: 'tableHeader' },
                { text: 'Solicita Empleado', style: 'tableHeader' },
                { text: 'Días para solicitar', style: 'tableHeader' },
                { text: 'Incluye almuerzo', style: 'tableHeader' },
                { text: 'Afecta Vacaciones', style: 'tableHeader' },
                { text: 'Acumular', style: 'tableHeader' },
                { text: 'Notificar por correo', style: 'tableHeader' },
                { text: 'Descuento', style: 'tableHeader' },
                { text: 'Actualizar', style: 'tableHeader' },
                { text: 'Eliminar', style: 'tableHeader' },
                { text: 'Preautorizar', style: 'tableHeader' },
                { text: 'Autorizar', style: 'tableHeader' },
                { text: 'Legalizar', style: 'tableHeader' },
                { text: 'Días para Justificar', style: 'tableHeader' }
              ],
              ...this.tipoPermiso.map(obj => {
                var descuento = this.DescuentoSelect[obj.tipo_descuento - 1];
                var acceso = this.AccesoEmpleadoSelect[obj.acce_empleado - 1];
                return [
                  { text: obj.id, style: 'itemsTable' },
                  { text: obj.descripcion, style: 'itemsTable' },
                  { text: obj.num_dia_maximo, style: 'itemsTable' },
                  { text: obj.num_hora_maximo, style: 'itemsTable' },
                  { text: acceso, style: 'itemsTable' },
                  { text: obj.num_dia_ingreso, style: 'itemsTable' },
                  { text: obj.almu_incluir, style: 'itemsTable' },
                  { text: obj.vaca_afecta, style: 'itemsTable' },
                  { text: obj.anio_acumula, style: 'itemsTable' },
                  { text: obj.correo, style: 'itemsTable' },
                  { text: descuento, style: 'itemsTable' },
                  { text: obj.actualizar, style: 'itemsTable' },
                  { text: obj.eliminar, style: 'itemsTable' },
                  { text: obj.preautorizar, style: 'itemsTable' },
                  { text: obj.autorizar, style: 'itemsTable' },
                  { text: obj.legalizar, style: 'itemsTable' },
                  { text: obj.gene_justificacion, style: 'itemsTable' },
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
   *                                       MÉTODO PARA EXPORTAR A EXCEL
   ******************************************************************************************************/
  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tipoPermiso);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'TipoPermisos');
    xlsx.writeFile(wb, "TipoPermisos" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   *                                        MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tipoPermiso);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "TipoPermisosCSV" + new Date().getTime() + '.csv');
  }

  /* ****************************************************************************************************
   *                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloTipoPermisos = [];
    this.tipoPermiso.forEach(obj => {
      var descuento = this.DescuentoSelect[obj.tipo_descuento - 1];
      var acceso = this.AccesoEmpleadoSelect[obj.acce_empleado - 1];
      objeto = {
        "tipo_permiso": {
          '@id': obj.id,
          "descripcion": obj.descripcion,
          "num_dia_maximo": obj.num_dia_maximo,
          "num_hora_maximo": obj.num_hora_maximo,
          "acce_empleado": acceso,
          "num_dia_ingreso": obj.num_dia_ingreso,
          "almu_incluir": obj.almu_incluir,
          "vaca_afecta": obj.vaca_afecta,
          "anio_acumula": obj.anio_acumula,
          "correo": obj.correo,
          "tipo_descuento": descuento,
          "actualizar": obj.actualizar,
          "eliminar": obj.eliminar,
          "preautorizar": obj.preautorizar,
          "autorizar": obj.autorizar,
          "legalizar": obj.legalizar,
          "fec_validar": obj.fec_validar,
          "gene_justificacion": obj.gene_justificacion,
        }
      }
      arregloTipoPermisos.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloTipoPermisos).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://localhost:3000/departamento/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

}
