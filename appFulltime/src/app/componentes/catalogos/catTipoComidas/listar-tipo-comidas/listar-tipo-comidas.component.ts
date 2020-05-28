import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { TipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';
import { EditarTipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/editar-tipo-comidas/editar-tipo-comidas.component';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-listar-tipo-comidas',
  templateUrl: './listar-tipo-comidas.component.html',
  styleUrls: ['./listar-tipo-comidas.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class ListarTipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  // Almacenamiento de datos consultados  
  tipoComidas: any = [];
  filtroNombre = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: TipoComidasService,
    public router: Router,
    public vistaRegistrarDatos: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoComidas();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Lectura de datos
  ObtenerTipoComidas() {
    this.tipoComidas = [];
    this.rest.ConsultarTipoComida().subscribe(datos => {
      this.tipoComidas = datos;
    })
  }

  AbrirVentanaRegistrarTipoComidas(): void {
    this.vistaRegistrarDatos.open(TipoComidasComponent, { width: '350px' }).disableClose = true;
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarTipoComidasComponent, { width: '400px', data: datosSeleccionados }).disableClose = true;
    //console.log(datosSeleccionados.fecha);
  }

  LimpiarCampos() {
    this.BuscarTipoComidaForm.setValue({
      nombreForm: '',
    });
    this.ObtenerTipoComidas();
  }

  /**
   * 
   * GENERACION DE PDF
   * 
   */

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
    sessionStorage.setItem('Comidas', this.tipoComidas);
    return {
      pageOrientation: 'landscape',
      content: [
        {
          text: 'Comidas',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFAlmuerzos(),
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
        }
      }
    };
  }

  presentarDataPDFAlmuerzos() {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Id', style: 'tableHeader' },
            { text: 'Nombre', style: 'tableHeader' },
            { text: 'Observación', style: 'tableHeader' },
            { text: 'Valor', style: 'tableHeader' }
          ],
          ...this.tipoComidas.map(obj => {
            return [
              { text: obj.id, style: 'itemsTable' },
              { text: obj.nombre, style: 'itemsTable' },
              { text: obj.observacion, style: 'itemsTable' },
              { text: '$ ' + obj.valor, style: 'itemsTable' }
            ];
          })
        ]
      }
    };
  }

  /**
   * 
   * METODO PARA EXPORTAR A EXCEL
   * 
   */

  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tipoComidas);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'TiposComidas');
    xlsx.writeFile(wb, "Comidas" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tipoComidas);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "CatHorarioCSV" + new Date().getTime() + '.csv');
  }

}
