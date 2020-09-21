import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { KardexService } from 'src/app/servicios/reportes/kardex.service';

@Component({
  selector: 'app-asistencia-consolidado',
  templateUrl: './asistencia-consolidado.component.html',
  styleUrls: ['./asistencia-consolidado.component.css']
})

export class AsistenciaConsolidadoComponent implements OnInit {

  empleados: any = [];
  asistencia: any = [];

  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  apellido = new FormControl('', [Validators.minLength(2)]);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombre: '';
  filtroApellido: '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleadoD: any = [];
  idEmpleado: number;

  fec_inicio_mes = new FormControl('', Validators.required);
  fec_final_mes = new FormControl('', Validators.required);

  public fechasForm = new FormGroup({
    fec_inicio: this.fec_inicio_mes,
    fec_final: this.fec_final_mes
  })

  constructor(
    private restEmpleado: EmpleadoService,
    private restKardex: KardexService,
    private toastr: ToastrService
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleados();
    this.ObtenerEmpleadoSolicitaKardex(this.idEmpleado)
  }

  ObtenerEmpleados() {
    this.empleados = [];
    this.restEmpleado.getEmpleadosRest().subscribe(res => {
      this.empleados = res;
    });
  }

  // Método para ver la informacion del empleado 
  urlImagen: string;
  nombreEmpresa: string;
  ObtenerEmpleadoSolicitaKardex(idemploy: any) {
    this.empleadoD = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoD = data;
    });
    this.restKardex.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.urlImagen = 'data:image/jpeg;base64,' + res.imagen;
      this.nombreEmpresa = res.nom_empresa;
    });
  }

  /**
   * METODOS PARA OBTENER LA INFORMACION SEGUN EL REPORTE QUE REQUIERE
   */

  lista: any = [];
  ListaEmpleadosDetallado(palabra: string) {
    var id_empresa = parseInt(localStorage.getItem('empresa'));
    this.restKardex.ListadoEmpleadosConDepartamentoRegimen(id_empresa).subscribe(res => {
      this.lista = res
      console.log(this.lista)
      this.generarPdf(palabra, 2)
    })
  }

  kardex: any = [];
  KardexEmpleado(id_empleado: number, palabra: string) {
    console.log('conca');
    this.restKardex.ObtenerKardexVacacionDiasCalendarioByIdEmpleado(id_empleado).subscribe(res => {
      this.kardex = res;
      console.log(this.kardex);
      this.generarPdf(palabra, 3)
    })
  }



  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  f_inicio_req: string = '';
  f_final_req: string = '';
  habilitar: boolean = false;
  estilo: any = { 'visibility': 'hidden' };
  ValidarRangofechas(form) {
    var f_i = new Date(form.fec_inicio)
    var f_f = new Date(form.fec_final)

    if (f_i < f_f) {
      this.toastr.success('Fechas validas');
      this.f_inicio_req = f_i.toJSON().split('T')[0];
      this.f_final_req = f_f.toJSON().split('T')[0];
      this.habilitar = true
      this.estilo = { 'visibility': 'visible' };
    } else if (f_i > f_f) {
      this.toastr.info('Fecha final es menor a la fecha inicial');
      this.fechasForm.reset();
    } else if (f_i.toLocaleDateString() === f_f.toLocaleDateString()) {
      this.toastr.info('Fecha inicial es igual a la fecha final');
      this.fechasForm.reset();
    }
    console.log(f_i.toJSON());
    console.log(f_f.toJSON());
  }

  AsistenciaEmpleado(id_empleado: number, palabra: string) {
    if (this.f_inicio_req != '' && this.f_final_req != '') {
      this.restKardex.ReporteAsistenciaDetalleConsolidado(id_empleado, this.f_inicio_req, this.f_final_req).subscribe(res => {
        this.asistencia = res;
        console.log(this.asistencia);
        this.generarPdf(palabra, 1)
      })
    } else {
      this.toastr.error('Una de las fechas no a sido asignada', 'Error al ingresar Fechas');
    }
  }

  /* ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF 
  * ****************************************************************************************************/

  generarPdf(action = 'open', pdf: number) {

    let documentDefinition;

    if (pdf === 1) {
      documentDefinition = this.getDocumentDefinicionAsistencia();
    } else if (pdf === 2) {
      documentDefinition = this.getDocumentDefinicionListaEmpleados();
    } else if (pdf === 3) {
      documentDefinition = this.getDocumentDefinicionKardex();
    }

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  /**********************************
   *  METODOS PARA IMPRIMIR LA ASISTENCIA
   **********************************/
  fechaHoy: string;
  getDocumentDefinicionAsistencia() {
    sessionStorage.setItem('Empleado', this.empleados);
    var f = new Date();
    f.setUTCHours(f.getHours())
    this.fechaHoy = f.toJSON();
    console.log(this.fechaHoy);

    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Reporte', color: 'blue', opacity: 0.1, bold: true, italics: false },
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
              alignment: 'center',
            }
          ]
        },
        {
          style: 'subtitulos',
          text: 'Reporte - Asistencia Detalle Consolidado'
        },
        {
          style: 'subtitulos',
          text: 'Periodo del: ' + this.asistencia.detalle[0].fecha.split("T")[0] + ' al ' + this.asistencia.detalle[this.asistencia.detalle.length - 1].fecha.split("T")[0]
        },
        this.CampoCiudad(this.asistencia.empleado[0].ciudad),
        this.CampoInfoEmpleado(this.asistencia.empleado[0]),
        this.CampoDetalleAsistencia(this.asistencia.detalle),
        this.CampoOperaciones(this.asistencia.operaciones[0]),
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
          margin: [0, 5, 0, 5]
        },
        itemsTableDesHas: {
          fontSize: 9,
          margin: [0, 5, 0, 5]
        },
        itemsTableCentrado: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        subtitulos: {
          fontSize: 16,
          alignment: 'center',
          margin: [0, 5, 0, 10]
        }
      }
    };
  }

  CampoCiudad(ciudad: string) {
    return {
      table: {
        widths: ['*'],
        body: [
          [
            {
              bold: true,
              fillColor: '#E1BB10',
              border: [false, false, false, false],
              text: 'CIUDAD: ' + ciudad,
            }
          ]
        ]
      }
    }
  }

  CampoInfoEmpleado(e: any) {
    return {
      table: {
        widths: ['auto', '*', '*'],
        body: [
          [
            {
              bold: true,
              fillColor: '#1BAEFD',
              border: [false, false, false, false],
              text: 'EMPLEADO: ' + e.nombre,
            },
            {
              bold: true,
              fillColor: '#1BAEFD',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'C.C.: ' + e.cedula,
            },
            {
              bold: true,
              fillColor: '#1BAEFD',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'COD: ' + e.codigo,
            }
          ]
        ]
      }
    }
  }

  CampoDetalleAsistencia(d: any[]) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { colSpan: 4, text: 'ENTRADA', style: 'tableHeader' },
            '', '', '',
            { colSpan: 3, text: 'SALIDA A', style: 'tableHeader' },
            '', '',
            { colSpan: 3, text: 'ENTRADA A', style: 'tableHeader' },
            '', '',
            { colSpan: 3, text: 'SALIDA', style: 'tableHeader' },
            '', '',
            { text: 'ATRASO', style: 'tableHeader' },
            { text: 'SAL ANTES', style: 'tableHeader' },
            { text: 'ALMUE', style: 'tableHeader' },
            { text: 'HORA TRAB', style: 'tableHeader' },
            { text: 'HORA SUPL', style: 'tableHeader' },
            { text: 'HORA EX. L-V', style: 'tableHeader' },
            { text: 'HORA EX. S-D', style: 'tableHeader' },
          ],
          ...d.map(obj => {
            return [
              { style: 'itemsTable', text: obj.fecha_mostrar },
              { style: 'itemsTable', text: obj.E.hora_default },
              { style: 'itemsTable', text: obj.E.hora_timbre },
              { style: 'itemsTable', text: obj.E.descripcion },
              { style: 'itemsTable', text: obj.S_A.hora_default },
              { style: 'itemsTable', text: obj.S_A.hora_timbre },
              { style: 'itemsTable', text: obj.S_A.descripcion },
              { style: 'itemsTable', text: obj.E_A.hora_default },
              { style: 'itemsTable', text: obj.E_A.hora_timbre },
              { style: 'itemsTable', text: obj.E_A.descripcion },
              { style: 'itemsTable', text: obj.S.hora_default },
              { style: 'itemsTable', text: obj.S.hora_timbre },
              { style: 'itemsTable', text: obj.S.descripcion },
              { style: 'itemsTable', text: obj.atraso },
              { style: 'itemsTable', text: obj.sal_antes },
              { style: 'itemsTable', text: obj.almuerzo },
              { style: 'itemsTable', text: obj.hora_trab },
              { style: 'itemsTable', text: obj.hora_supl },
              { style: 'itemsTable', text: obj.hora_ex_L_V },
              { style: 'itemsTable', text: obj.hora_ex_S_D },
            ]
          })
        ]
      }
    }
  }

  CampoOperaciones(objeto: any) {
    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { rowSpan: 2, colSpan: 13, text: 'TOTAL', style: 'tableHeader' },
            '', '', '', '', '', '', '', '', '', '', '', '',
            { text: objeto.HHMM.atraso, style: 'tableHeader' },
            { text: objeto.HHMM.sal_antes, style: 'tableHeader' },
            { text: objeto.HHMM.almuerzo, style: 'tableHeader' },
            { text: objeto.HHMM.hora_trab, style: 'tableHeader' },
            { text: objeto.HHMM.hora_supl, style: 'tableHeader' },
            { text: objeto.HHMM.hora_ex_L_V, style: 'tableHeader' },
            { text: objeto.HHMM.hora_ex_S_D, style: 'tableHeader' },
          ],
          [
            '', '', '', '', '', '', '', '', '', '', '', '', '',
            { text: objeto.decimal.atraso.toString().slice(0, 8), style: 'tableHeader' },
            { text: objeto.decimal.sal_antes.toString().slice(0, 8), style: 'tableHeader' },
            { text: objeto.decimal.almuerzo.toString().slice(0, 8), style: 'tableHeader' },
            { text: objeto.decimal.hora_trab.toString().slice(0, 8), style: 'tableHeader' },
            { text: objeto.decimal.hora_supl.toString().slice(0, 8), style: 'tableHeader' },
            { text: objeto.decimal.hora_ex_L_V.toString().slice(0, 8), style: 'tableHeader' },
            { text: objeto.decimal.hora_ex_S_D.toString().slice(0, 8), style: 'tableHeader' },
          ]
        ]
      }
    }
  }

  /**********************************************
   *  METODOS PARA IMPRIMIR LA LISTA DE EMPLEADOS
   **********************************************/
  getDocumentDefinicionListaEmpleados() {
    sessionStorage.setItem('Empleado', this.empleados);
    var f = new Date();
    f.setUTCHours(f.getHours())
    this.fechaHoy = f.toJSON();
    console.log(this.fechaHoy);

    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Reporte', color: 'blue', opacity: 0.1, bold: true, italics: false },
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
              alignment: 'center',
            }
          ]
        },
        {
          style: 'subtitulos',
          text: 'Listado - Empleados'
        },
        this.ObtenerListadoDetallado(this.lista),
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
          margin: [0, 5, 0, 5]
        },
        tableHeaderDetalle: {
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED',
          fontSize: 12,
          margin: [0, 5, 0, 5]
        },
        itemsTableDetalle: {
          fontSize: 11,
          margin: [0, 5, 0, 5]
        },
        subtitulos: {
          fontSize: 16,
          alignment: 'center',
          margin: [0, 5, 0, 10]
        }
      }
    };
  }

  ObtenerListadoDetallado(datos: any[]) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'CEDULA', style: 'tableHeaderDetalle' },
            { text: 'CODIGO', style: 'tableHeaderDetalle' },
            { text: 'APELLIDOS Y NOMBRES', style: 'tableHeaderDetalle' },
            { text: 'DEPARTAMENTOS', style: 'tableHeaderDetalle' },
            { text: 'CARGO', style: 'tableHeaderDetalle' },
            { text: 'GRUPO', style: 'tableHeaderDetalle' },
            { text: 'DETALLE GRUPO', style: 'tableHeaderDetalle' }
          ],
          ...datos.map(obj => {
            return [
              { style: 'itemsTableDetalle', text: obj.cedula },
              { style: 'itemsTableDetalle', text: obj.codigo },
              { style: 'itemsTableDetalle', text: obj.nom_completo },
              { style: 'itemsTableDetalle', text: obj.departamento },
              { style: 'itemsTableDetalle', text: obj.cargo },
              { style: 'itemsTableDetalle', text: obj.grupo },
              { style: 'itemsTableDetalle', text: obj.detalle_grupo }
            ]
          })
        ]
      }
    }
  }

  /**********************************
   *  METODOS PARA IMPRIMIR EL KARDEX
   **********************************/
  getDocumentDefinicionKardex() {
    sessionStorage.setItem('Empleado', this.empleados);
    var f = new Date();
    f.setUTCHours(f.getHours())
    this.fechaHoy = f.toJSON();
    console.log(this.fechaHoy);

    return {
      // pageOrientation: 'landscape',
      watermark: { text: 'Reporte', color: 'blue', opacity: 0.1, bold: true, italics: false },
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
              alignment: 'center',
            }
          ]
        },
        {
          style: 'subtitulos',
          text: 'Reporte - Kardex Vacaciones Días Calendario'
        },
        {
          style: 'subtitulos',
          text: 'Fecha de Corte: ' + this.fechaHoy.split("T")[0] + ' ' + this.fechaHoy.split("T")[1].slice(0, 5)
        },
        this.CampoCiudad(this.kardex.empleado[0].ciudad),
        this.CampoInfoEmpleado(this.kardex.empleado[0]),
        this.CampoFechas(this.kardex.empleado[0]),
        this.CampoDetallePeriodo(this.kardex.detalle),
        this.CampoLiquidacionProporcional(this.kardex.proporcional.antiguedad[0], this.kardex.proporcional.periodo[0], this.kardex.liquidacion[0]),


        // this.presentarDataPDFEmpleados(),
        // this.kardex
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
          fontSize: 11,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 10,
          margin: [0, 5, 0, 5]
        },
        itemsTableDesHas: {
          fontSize: 9,
          margin: [0, 5, 0, 5]
        },
        itemsTableCentrado: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        subtitulos: {
          fontSize: 16,
          alignment: 'center',
          margin: [0, 5, 0, 10]
        }
      }
    };
  }

  CampoFechas(e: any) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', '*'],
        body: [
          [
            {
              bold: true,
              fillColor: '#EAEAEA',
              border: [false, false, false, false],
              text: 'F.INGRESO: ' + e.fec_ingreso.split('T')[0]
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              border: [false, false, false, false],
              text: 'F.SALIDA: '
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'F.CARGA: ' + e.fec_carga.split('T')[0],
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'ACUM: '
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              border: [false, false, false, false],
              text: 'ESTADO: ' + e.estado
            },
          ]
        ]
      }
    }
  }

  CampoDetallePeriodo(d: any[]) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 25, 25, 25, 25, 25, 25],
        body: [
          [
            { rowSpan: 2, text: 'Periodo', style: 'tableHeader' },
            { rowSpan: 2, text: 'Detalle', style: 'tableHeader' },
            { rowSpan: 2, text: 'Desde', style: 'tableHeader' },
            { rowSpan: 2, text: 'Hasta', style: 'tableHeader' },
            { colSpan: 3, text: 'Descuento', style: 'tableHeader' },
            '', '',
            { colSpan: 3, text: 'Saldo', style: 'tableHeader' },
            '', ''
          ],
          [
            '', '', '', '',
            {
              style: 'tableHeader',
              text: 'Dias'
            },
            {
              style: 'tableHeader',
              text: 'Hor'
            },
            {
              style: 'tableHeader',
              text: 'Min'
            },
            {
              style: 'tableHeader',
              text: 'Dias'
            },
            {
              style: 'tableHeader',
              text: 'Hor'
            },
            {
              style: 'tableHeader',
              text: 'Min'
            }
          ],
          ...d.map(obj => {
            return [
              { style: 'itemsTableCentrado', text: obj.periodo },
              { style: 'itemsTable', text: obj.detalle },
              { style: 'itemsTableDesHas', text: obj.desde.split("T")[0] + ' ' + obj.desde.split("T")[1].slice(0, 5) },
              { style: 'itemsTableDesHas', text: obj.hasta.split("T")[0] + ' ' + obj.desde.split("T")[1].slice(0, 5) },
              { style: 'itemsTableCentrado', text: obj.descuento.dias },
              { style: 'itemsTableCentrado', text: obj.descuento.horas },
              { style: 'itemsTableCentrado', text: obj.descuento.min },
              { style: 'itemsTableCentrado', text: obj.saldo.dias },
              { style: 'itemsTableCentrado', text: obj.saldo.horas },
              { style: 'itemsTableCentrado', text: obj.saldo.min }]
          })
        ]
      }
    }
  }

  CampoLiquidacionProporcional(antiguedad: any, periodo: any, liquidacion: any) {
    console.log(antiguedad);
    console.log(periodo);
    console.log(liquidacion);
    return {
      table: {
        widths: [25, 25, 25, 25, 25, 25, 25, 25, 25],
        body: [
          [
            { colSpan: 6, text: 'Proporcional', style: 'tableHeader' },
            '', '', '', '', '',
            { rowSpan: 2, colSpan: 3, text: 'Liquidacion', style: 'tableHeader' },
            '', ''
          ],
          [
            { colSpan: 3, text: 'Antigüedad', style: 'tableHeader' },
            '', '',
            { colSpan: 3, text: 'Periódo', style: 'tableHeader' },
            '', '',
            '', '', ''
          ],
          [
            { style: 'tableHeader', text: 'Dias' },
            { style: 'tableHeader', text: 'Hor' },
            { style: 'tableHeader', text: 'Min' },
            { style: 'tableHeader', text: 'Dias' },
            { style: 'tableHeader', text: 'Hor' },
            { style: 'tableHeader', text: 'Min' },
            { style: 'tableHeader', text: 'Dias' },
            { style: 'tableHeader', text: 'Hor' },
            { style: 'tableHeader', text: 'Min' }
          ],
          [
            { style: 'itemsTableCentrado', text: antiguedad.dias },
            { style: 'itemsTableCentrado', text: antiguedad.horas },
            { style: 'itemsTableCentrado', text: antiguedad.min },
            { style: 'itemsTableCentrado', text: periodo.dias },
            { style: 'itemsTableCentrado', text: periodo.horas },
            { style: 'itemsTableCentrado', text: periodo.min },
            { style: 'itemsTableCentrado', text: liquidacion.dias },
            { style: 'itemsTableCentrado', text: liquidacion.horas },
            { style: 'itemsTableCentrado', text: liquidacion.min }
          ],
          [
            { colSpan: 3, text: antiguedad.valor.toString().slice(0, 8), style: 'itemsTableCentrado' },
            '', '',
            { colSpan: 3, text: periodo.valor.toString().slice(0, 8), style: 'itemsTableCentrado' },
            '', '',
            { colSpan: 3, text: liquidacion.valor.toString().slice(0, 8), style: 'itemsTableCentrado' },
            '', ''
          ]
        ]
      }
    }
  }

  /****************************************************************************************************** 
   *                                       MÉTODO PARA EXPORTAR A EXCEL
   ******************************************************************************************************/
  exportToExcelAsistencia(id_empleado: number) {
    this.restKardex.ReporteAsistenciaDetalleConsolidado(id_empleado, '2020-08-01', '2020-08-31').subscribe(res => {
      this.asistencia = res;
      console.log(this.asistencia);
      const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.asistencia.detalle.map(obj => {
        return {
          fecha: obj.fecha_mostrar,
          E_h_default: obj.E.hora_default,
          E_h_timbre: obj.E.hora_timbre,
          E_descripcion: obj.E.descripcion,
          S_A_h_default: obj.S_A.hora_default,
          S_A_h_timbre: obj.S_A.hora_timbre,
          S_A_descripcion: obj.S_A.descripcion,
          E_A_h_default: obj.E_A.hora_default,
          E_A_h_timbre: obj.E_A.hora_timbre,
          E_A_descripcion: obj.E_A.descripcion,
          S_h_default: obj.S.hora_default,
          S_h_timbre: obj.S.hora_timbre,
          S_descripcion: obj.S.descripcion,
          atraso: obj.atraso,
          sal_antes: obj.sal_antes,
          almuerzo: obj.almuerzo,
          hora_trab: obj.hora_trab,
          hora_supl: obj.hora_supl,
          hora_ex_L_V: obj.hora_ex_L_V,
          hora_ex_S_D: obj.hora_ex_S_D,
        }
      }));
      const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.asistencia.empleado);
      const wso: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.asistencia.operaciones.map(obj => {
        return {
          HHMM_atraso: obj.HHMM.atraso,
          HHMM_sal_antes: obj.HHMM.sal_antes,
          HHMM_almuerzo: obj.HHMM.almuerzo,
          HHMM_hora_trab: obj.HHMM.hora_trab,
          HHMM_hora_supl: obj.HHMM.hora_supl,
          HHMM_hora_ex_L_V: obj.HHMM.hora_ex_L_V,
          HHMM_hora_ex_S_D: obj.HHMM.hora_ex_S_D,
          decimal_atraso: obj.decimal.atraso.toString().slice(0, 8),
          decimal_sal_antes: obj.decimal.sal_antes.toString().slice(0, 8),
          decimal_almuerzo: obj.decimal.almuerzo.toString().slice(0, 8),
          decimal_hora_trab: obj.decimal.hora_trab.toString().slice(0, 8),
          decimal_hora_supl: obj.decimal.hora_supl.toString().slice(0, 8),
          decimal_hora_ex_L_V: obj.decimal.hora_ex_L_V.toString().slice(0, 8),
          decimal_hora_ex_S_D: obj.decimal.hora_ex_S_D.toString().slice(0, 8),
        }
      }));
      const wb: xlsx.WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, wsd, 'Detalle');
      xlsx.utils.book_append_sheet(wb, wse, 'Empleado');
      xlsx.utils.book_append_sheet(wb, wso, 'Operaciones');
      xlsx.writeFile(wb, "Asistencia - " + this.asistencia.empleado.nombre + '.xlsx');
    })
  }

  exportToExcelListaEmpleados() {
    var id_empresa = parseInt(localStorage.getItem('empresa'));
    this.restKardex.ListadoEmpleadosConDepartamentoRegimen(id_empresa).subscribe(res => {
      this.lista = res
      console.log(this.lista)
      const wsl: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.lista);
      const wb: xlsx.WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, wsl, 'lista-empleados');
      xlsx.writeFile(wb, "lista-empleados" + new Date().getTime() + '.xlsx');
    })
  }

  /**
   * METODOS PARA CONTROLAR INGRESO DE LETRAS
   */

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  limpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
  }

  limpiarCamposRango() {
    this.fechasForm.reset();
    this.habilitar = false;
    this.estilo = { 'visibility': 'hidden' };
  }
}
