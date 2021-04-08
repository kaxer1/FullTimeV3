import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-listar-pedido-accion',
  templateUrl: './listar-pedido-accion.component.html',
  styleUrls: ['./listar-pedido-accion.component.css']
})
export class ListarPedidoAccionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

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
    // sessionStorage.setItem('Roles', this.roles);

    return {

      // Encabezado de la página
      // pageOrientation: 'portrait',
      pageSize: 'A4',
      background: function (currentPage, pageSize) {
        return {
          table: {
            widths: [pageSize.width - 30],
            heights: [pageSize.height - 30],
            body: [['']]
          },
          margin: 10,
        };
      },
      pageBreak: 'before',
      content: [
       // { text: 'Column/row spans', pageBreak: 'before', style: 'subheader' },

        this.prueba(),
      ],

    };
  }

  presentarDataPDFRoles() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [50, 150],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
              ],
              /* ...this.roles.map(obj => {
                 return [
                   { text: obj.id, style: 'itemsTable' },
                   { text: obj.nombre, style: 'itemsTable' },
                 ];
               })*/
            ],
          },
        },
        { width: '*', text: '' },
      ]
    };
  }

  prueba() {
    var dd = {
      background: function (currentPage, pageSize) {
        return {
          table: {
            widths: [pageSize.width - 30],
            heights: [pageSize.height - 30],
            body: [['']]
          },
          margin: 10
        };
      },
    }
  }

}
