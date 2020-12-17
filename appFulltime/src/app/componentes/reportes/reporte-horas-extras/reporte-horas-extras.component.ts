import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { KardexService } from 'src/app/servicios/reportes/kardex.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-horas-extras',
  templateUrl: './reporte-horas-extras.component.html',
  styleUrls: ['./reporte-horas-extras.component.css']
})
export class ReporteHorasExtrasComponent implements OnInit {

  fec_inicia: string = '2020-12-01';
  fec_fin: string = '2020-12-31';
  horas_extras: any;

  Lista_empleados: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

   /**
   * Variables Tabla de datos
   */
  dataSource: any;  
  filtroEmpleados = '';

  idEmpleado: number;
  empleadoD: any = [];

  constructor(
    private restEmpleado: EmpleadoService,
    private restReporte: KardexService,
    private toastr: ToastrService,
    private restEmpre: EmpresaService,
  ) { }

  ngOnInit(): void {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.ObtenerEmpleados();
    this.ObtenerEmpleadoSolicitaKardex(this.idEmpleado);
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerEmpleados() {
    this.dataSource = new MatTableDataSource(JSON.parse(sessionStorage.getItem('lista-empleados')));
    this.Lista_empleados = this.dataSource.data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroEmpleados = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para ver la informacion del empleado 
  urlImagen: string;
  nombreEmpresa: string;
  ObtenerEmpleadoSolicitaKardex(idemploy: any) {
    this.empleadoD = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoD = data;
    });
    this.restReporte.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.urlImagen = 'data:image/jpeg;base64,' + res.imagen;
      this.nombreEmpresa = res.nom_empresa;
    });
  }

  // Método para obtener colores de empresa
  p_color: any;
  s_color: any;
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  ObtenerReporte(id_empleado, palabra: string) {
    this.restReporte.ReporteHorasExtras(id_empleado, this.fec_inicia, this.fec_fin).subscribe(res => {
      console.log(res);
      this.horas_extras = res
      this.generarPdf(palabra, 2)

    }, err => {
      console.log(err);
      this.toastr.error(err.error.message)
    });
  }

   /* ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF 
  * ****************************************************************************************************/
 fechaHoy: string;

 generarPdf(action = 'open', pdf: number) {

   let documentDefinition;

   if (pdf === 2) {
    documentDefinition = this.getDocumentHorasExtras();
  }

   switch (action) {
     case 'open': pdfMake.createPdf(documentDefinition).open(); break;
     case 'print': pdfMake.createPdf(documentDefinition).print(); break;
     case 'download': pdfMake.createPdf(documentDefinition).download(); break;

     default: pdfMake.createPdf(documentDefinition).open(); break;
   }
 }

 /**********************************************
   *  METODOS PARA IMPRIMIR REPORTE DE HORAS EXTRAS
   **********************************************/
  getDocumentHorasExtras() {
    // sessionStorage.setItem('Empleado', this.empleados);
    var f = new Date();
    f.setUTCHours(f.getHours())
    this.fechaHoy = f.toJSON();
    // console.log(this.fechaHoy);
    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoD[0].nombre + ' ' + this.empleadoD[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

      footer: function (currentPage, pageCount, fecha) {
        fecha = f.toJSON().split("T")[0];
        var timer = f.toJSON().split("T")[1].slice(0, 5);
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha + ' Hora: ' + timer,
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', color: 'blue', opacity: 0.5
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
          columns: [
            {
              image: this.urlImagen,
              width: 90,
              height: 40,
            },
            {
              width: '*',
              text: this.nombreEmpresa,
              bold: true,
              fontSize: 20,
              margin: [230, 10, 0, 0],
            }
          ]
        },
        {
          style: 'subtitulos',
          text: 'Reporte Horas Extras'
        },
        this.ImpresionInformacion(this.horas_extras.info[0]),
        this.ImpresionDetalle(this.horas_extras.detalle),
        this.ImprimirTotal(this.horas_extras.total),
      ],
      styles: {
        tableHeaderDetalle: { bold: true, alignment: 'center', fillColor: this.p_color, fontSize: 12, margin: [0, 5, 0, 5] },
        itemsTableDetalle: { fontSize: 10, margin: [0, 5, 0, 5] },
        subtitulos: { fontSize: 16, alignment: 'center', margin: [0, 5, 0, 10] },
        tableTotal: { fontSize: 18, bold: true, alignment: 'center', fillColor: this.p_color, margin: [0, 5, 0, 10] },
        tableHeader: { fontSize: 9, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8, margin: [0, 3, 0, 3],  },
        itemsTableInfo: { fontSize: 10, margin: [0, 5, 0, 5] },
        tableMargin: { margin: [0, 20, 0, 0] },
        CabeceraTabla: { fontSize: 12, alignment: 'center', margin: [0, 8, 0, 8], fillColor: this.p_color},
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 8, color: 'blue', opacity: 0.5 }
      }
    };
  }

  ImpresionInformacion(e: any) {
    return {
      table: {
        widths: ['*', 'auto', 'auto'],
        body: [
          [
            { colSpan: 3, text: 'INFORMACIÓN GENERAL EMPLEADO', style: 'CabeceraTabla' },
            '', ''
          ],
          [
            {
              border: [true, true, false, true],
              bold: true,
              text: 'PERIODO DEL: ' + String(moment('2020/12/01', "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + String(moment('2020/12/31', "YYYY/MM/DD").format("DD/MM/YYYY")),
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, false, true],
              text: 'CIUDAD: ' + 'Quito',
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, true, true],
              text: 'N° REGISTROS: ' + this.horas_extras.detalle.length,
              style: 'itemsTableInfo'
            }
          ],
          [
            {
              border: [true, true, false, true],
              text: 'EMPLEADO: ' + e.nombre,
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, false, true],
              text: 'C.C.: ' + e.cedula,
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, true, true],
              text: 'COD: ' + e.codigo,
              style: 'itemsTableInfo'
            }
          ],
          [
            {
              border: [true, true, false, true],
              text: 'SUELDO: ' + e.sueldo,
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, false, true],
              text: 'HORAS TRABAJA DIA: ' + e.hora_trabaja,
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, true, true],
              text: ' ',
              style: 'itemsTableInfo'
            }
          ]
        ]
      }
    }
  }
  
  ImpresionDetalle(datosRest: any[] ) {
    let contador = 0;
    return {
      table: {
        headerRows: 1,
        widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto'],
        body: [
          this.FuncionTituloColumna(),
          ...datosRest.map((obj) => {
            contador = contador + 1;
            var array = [
              { style: 'itemsTableDetalle', text: contador },
              { style: 'itemsTableDetalle', text: obj.descripcion },
              { style: 'itemsTableDetalle', text: obj.fec_inicio.split('T')[0] + ' ' + obj.fec_inicio.split('T')[1].split('.')[0]},
              { style: 'itemsTableDetalle', text: obj.fec_final.split('T')[0] + ' ' + obj.fec_final.split('T')[1].split('.')[0]},
              { style: 'itemsTableDetalle', text: obj.total_horas},
              { style: 'itemsTableDetalle', text: obj.porcentaje},
              { style: 'itemsTableDetalle', text: obj.valor_recargo.toString().slice(0,6) },
              { style: 'itemsTableDetalle', text: obj.valor_hora_total},
              { style: 'itemsTableDetalle', text: obj.valor_pago}
            ]
            return array 
          })
        ]
      },
      layout: {
        fillColor: function (rowIndex) {
          return (rowIndex % 2 === 0) ? '#E5E7E9' : null;
        }
      }
    }
  }

  FuncionTituloColumna() {
    var arrayTitulos = [
      { text: 'N°', style: 'tableHeaderDetalle' },
      { text: 'Descripcion', style: 'tableHeaderDetalle' },
      { text: 'Fecha Inicio', style: 'tableHeaderDetalle' },
      { text: 'Fecha Final', style: 'tableHeaderDetalle' },
      { text: 'Horas', style: 'tableHeaderDetalle' },
      { text: 'Porcentaje', style: 'tableHeaderDetalle' },
      { text: 'Valor recargo', style: 'tableHeaderDetalle' },
      { text: 'Valor hora', style: 'tableHeaderDetalle' },
      { text: 'Valor pago', style: 'tableHeaderDetalle' }
    ]

    return arrayTitulos
  }

  ImprimirTotal(t:any) {
    
    var arrayTitulos = [
      { text: 'VALOR HORAS EXTRAS: $ ' + t.total_pago_hx , style: 'tableTotal' },
      { text: 'TOTAL SUELDO: $ ' + t.total_sueldo , style: 'tableTotal' },
    ]
    
    return arrayTitulos
  }

}
