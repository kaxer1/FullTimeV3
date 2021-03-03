import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { KardexService } from 'src/app/servicios/reportes/kardex.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { IReporteAsistenciaConsolidada, IRestAsisteConsoli, IRestTotalAsisteConsoli} from '../../../model/reportes.model'
import { ConfigAsistenciaComponent } from '../../reportes-Configuracion/config-report-asistencia/config-asistencia.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EmpleadoElemento } from 'src/app/model/empleado.model';

@Component({
  selector: 'app-asistencia-consolidado',
  templateUrl: './asistencia-consolidado.component.html',
  styleUrls: ['./asistencia-consolidado.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
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

  anio_inicio = new FormControl('', Validators.required);
  anio_final = new FormControl('', Validators.required);

  public fechasKardexForm = new FormGroup({
    fec_inicio: this.anio_inicio,
    fec_final: this.anio_final
  })

  selection = new SelectionModel<EmpleadoElemento>(true, []);

  constructor(
    private restEmpleado: EmpleadoService,
    private restKardex: KardexService,
    private restEmpre: EmpresaService,
    private toastr: ToastrService,
    private openVentana: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.ObtenerEmpleados();
    this.ObtenerEmpleadoSolicitaKardex(this.idEmpleado);
    this.ObtnerColores();
    this.MensajeInicio();
  }

  btnCheckDeshabilitado: boolean = false;
  HabilitarSeleccionDesactivados() {
    if (this.btnCheckDeshabilitado === false) {
      this.btnCheckDeshabilitado = true;
    } else if (this.btnCheckDeshabilitado === true) {
      this.btnCheckDeshabilitado = false;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.empleados.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.empleados.forEach(row => this.selection.select(row));
  }

  checkboxLabelDos(row?: EmpleadoElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // mensaje de advertencia si tiene o no la configuracion para seleccionar los campos a imprimir
  MensajeInicio() {
    if (!!sessionStorage.getItem('arrayConfigAsistencia') === false) {
      if (this.habilitar === false) {
        this.estilo = { 'visibility': 'hidden' };
      }
      this.toastr.info('Configurar primero los campos a imprimir', 'Configurar campos Pdf', {
        timeOut: 10000,
      }).onTap.subscribe(items => {
        console.log(items);
        this.ConfiguracionReporteAsistencia();
      });
    } else {
      if (this.habilitar === true) {
        this.estilo = { 'visibility': 'visible' };
      }
    }
  }

  // Obtener lista de empleados

  ObtenerEmpleados() {
    this.empleados = [];
    this.restEmpleado.getEmpleadosRest().subscribe(res => {
      this.empleados = res;
      console.log(this.empleados);
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

  // Método para obtener colores de empresa
  p_color: any;
  s_color: any;
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  // Metodo de la paginacion
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  /**
   * Funciones para validar los campos y las fechas de rangos del reporte
   */

  f_inicio_req: string = '';
  f_final_req: string = '';
  habilitar: boolean = false;
  estilo: any = { 'visibility': 'hidden' };
  ValidarRangofechas(form) {
    var f_i = new Date(form.fec_inicio)
    var f_f = new Date(form.fec_final)

    if (f_i < f_f) {
      this.toastr.success('Fechas validas','', {
        timeOut: 6000,
      });
      this.f_inicio_req = f_i.toJSON().split('T')[0];
      this.f_final_req = f_f.toJSON().split('T')[0];
      this.habilitar = true
      this.estilo = { 'visibility': 'visible' };
    } else if (f_i > f_f) {
      this.toastr.info('Fecha final es menor a la fecha inicial','', {
        timeOut: 6000,
      });
      this.fechasForm.reset();
    } else if (f_i.toLocaleDateString() === f_f.toLocaleDateString()) {
      this.toastr.info('Fecha inicial es igual a la fecha final','', {
        timeOut: 6000,
      });
      this.fechasForm.reset();
    }
    // console.log(f_i.toJSON());
    // console.log(f_f.toJSON());
  }

  AsistenciaEmpleado(id_empleado: number, palabra: string) {
    this.asistencia = [];
    if (this.f_inicio_req != '' && this.f_final_req != '') {
      this.restKardex.ReporteAsistenciaDetalleConsolidado(id_empleado, this.f_inicio_req, this.f_final_req).subscribe(res => {
        if(res.message) {
          this.toastr.error(res.message,'hduhfuwy', {
            timeOut: 6000,
          });
        } else {
          this.asistencia = res;
          this.generarPdf(palabra, 1)
        }
      })
    } else {
      this.toastr.error('Una de las fechas no a sido asignada', 'Error al ingresar Fechas', {
        timeOut: 6000,
      });
    }
  }

  /**
   * Abrir ventana de selecion de campos para imprimir reporte 
   */

  ConfiguracionReporteAsistencia() {
    console.log('Esta listo para configurar');
    this.openVentana.open(ConfigAsistenciaComponent,{ width: '500px' }).afterClosed()
      .subscribe(res => { 
        if (res === true) {
          if (this.habilitar === true) {
            this.estilo = { 'visibility': 'visible' };
          }
        } else {
          if (this.habilitar === false) {
            this.estilo = { 'visibility': 'hidden' };
          }
        }
      })
    
    this.MensajeInicio()
  }
  /* ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF 
  * ****************************************************************************************************/

  generarPdf(action = 'open', pdf: number) {

    let documentDefinition;

    if (pdf === 1) {
      documentDefinition = this.getDocumentDefinicionAsistencia();
    }
    
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  /**********************************************
   *  METODOS PARA IMPRIMIR LA ASISTENCIA
   **********************************************/
  fechaHoy: string;
  getDocumentDefinicionAsistencia() {
    sessionStorage.setItem('Empleado', this.empleados);
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
        return [
          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'TRAB: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Trabaja', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'SAL: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Salida.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'ALMUE o A: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Fecha de termino de contrato.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'FT: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Falta Timbre.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'SUPL: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Suplementaria.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'EX. L-V: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Extra de lunes a viernes.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'EX. S-D: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Extra sabado a domingo.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'L: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Libre.', border: [false, false, false, false], style: ['quote', 'small'] }
                ]
              ]
            }
          },          
          {
            margin: [10, -2, 10, 0],
            columns: [
              'Fecha: ' + fecha + ' Hora: ' + timer,
              {
                text: [
                  {
                    text: '© Pag ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', color: 'blue', opacity: 0.5
                  }
                ],
              }
            ],
            fontSize: 9, color: '#A4B8FF',
          }
        ]
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
          text: 'Reporte - Asistencia Detalle Consolidado'
        },
        this.CampoInformacionGeneralAsistencia(this.asistencia.empleado[0].ciudad, this.asistencia.empleado[0]),
        this.CampoDetalleAsistencia(this.asistencia.detalle),
        this.CampoOperaciones(this.asistencia.operaciones[0]),
      ],
      styles: {
        tableTotal: { fontSize: 30, bold: true, alignment: 'center', fillColor: this.p_color },
        tableHeader: { fontSize: 9, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8, margin: [0, 3, 0, 3],  },
        itemsTableInfo: { fontSize: 10, margin: [0, 5, 0, 5] },
        subtitulos: { fontSize: 16, alignment: 'center', margin: [0, 5, 0, 10] },
        tableMargin: { margin: [0, 20, 0, 0] },
        CabeceraTabla: { fontSize: 12, alignment: 'center', margin: [0, 8, 0, 8], fillColor: this.p_color},
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 8, color: 'blue', opacity: 0.5 }
      }
    };
  }

  CampoInformacionGeneralAsistencia(ciudad: string, e: any) {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [
          [
            { colSpan: 3, text: 'INFORMACIÓN GENERAL EMPLEADO', style: 'CabeceraTabla' },
            '', ''
          ],
          [
            {
              border: [true, true, false, true],
              text: 'CIUDAD: ' + ciudad,
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, false, true],
              bold: true,
              text: 'PERIODO DEL: ' + String(moment(this.f_inicio_req, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + String(moment(this.f_final_req, "YYYY/MM/DD").format("DD/MM/YYYY")),
              style: 'itemsTableInfo'
            },
            {
              border: [false, true, true, true],
              text: 'N° REGISTROS: ' + this.asistencia.detalle.length,
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
          ]
        ]
      }
    }
  }

  CampoDetalleAsistencia(d: any[]) {
    // console.log(!!sessionStorage.getItem('arrayConfigAsistencia'));
    // console.log(!!sessionStorage.getItem('columnasValidasAsistencia'));
    if (!!sessionStorage.getItem('arrayConfigAsistencia') === false) {
      this.toastr.error('Configurar campos a imprimir antes de descargar o visualizar', 'Error Pdf', {
        timeOut: 10000,
      }).onTap.subscribe(items => {
        console.log(items);
        this.ConfiguracionReporteAsistencia();
      });

      return { text: 'No has seleccionado ningun campo de impresión.' }
    }
    
    if (!!sessionStorage.getItem('columnasValidasAsistencia') === false) {
      this.toastr.error('Configurar campos a imprimir antes de descargar o visualizar', 'Error Pdf', {
        timeOut: 10000,
      }).onTap.subscribe(items => {
        console.log(items);
        this.ConfiguracionReporteAsistencia();
      });

      return { text: 'No has seleccionado ningun campo de impresión.' }
    }

    let columnas = parseInt(sessionStorage.getItem('columnasValidasAsistencia'));
    let s = JSON.parse( sessionStorage.getItem('arrayConfigAsistencia')) as IReporteAsistenciaConsolidada;
    console.log(s);

    return this.FuncionRegistros(columnas, s, d);
  }

  FuncionRegistros(columnas: number, configuracion: IReporteAsistenciaConsolidada, datos: any[]) {
    let contador = 0;
    return {
      style: 'tableMargin',
      table: {
        headerRows: 1,
        widths: this.FuncionColumnas(columnas),
        body: [
          this.FuncionTituloColumna(configuracion),
          ...datos.map((obj:IRestAsisteConsoli) => {
            contador = contador + 1;
            var array = [
              { style: 'itemsTable', text: '1.' + contador },
              { style: 'itemsTable', text: '2.' + obj.fecha_mostrar },
              { style: 'itemsTable', text: '3.' + obj.E.hora_default },
              { style: 'itemsTable', text: '4.' + obj.E.hora_timbre },
              { style: 'itemsTable', text: '5.' + obj.E.descripcion },
              { style: 'itemsTable', text: '6.' + obj.S_A.hora_default },
              { style: 'itemsTable', text: '7.' + obj.S_A.hora_timbre },
              { style: 'itemsTable', text: '8.' + obj.S_A.descripcion },
              { style: 'itemsTable', text: '9.' + obj.E_A.hora_default },
              { style: 'itemsTable', text: '10.' + obj.E_A.hora_timbre },
              { style: 'itemsTable', text: '11.' + obj.E_A.descripcion },
              { style: 'itemsTable', text: '12.' + obj.S.hora_default },
              { style: 'itemsTable', text: '13.' + obj.S.hora_timbre },
              { style: 'itemsTable', text: '14.' + obj.S.descripcion },
              { style: 'itemsTable', text: '15.' + obj.atraso },
              { style: 'itemsTable', text: '16.' + obj.sal_antes },
              { style: 'itemsTable', text: '17.' + obj.almuerzo },
              { style: 'itemsTable', text: '18.' + obj.hora_trab },
              { style: 'itemsTable', text: '19.' + obj.hora_supl },
              { style: 'itemsTable', text: '20.' + obj.hora_ex_L_V },
              { style: 'itemsTable', text: '21.' + obj.hora_ex_S_D },
            ]

            let index = 0;
            let cont = 0;
            
              if (configuracion.atraso === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '15') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1) 
              }
              
              if (configuracion.salida_antes === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '16') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1)  
              }
              
              if (configuracion.almuerzo === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '17') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1) 
              } 
              
              if (configuracion.h_trab === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '18') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1)
              }
              
              if (configuracion.h_supl === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '19') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1)  
              }
              
              if (configuracion.h_ex_LV === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '20') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1)  
              }
              
              if (configuracion.h_ex_SD === false) { 
                cont = 0; index = 0;
                array.forEach(ele => {
                  if (ele.text.split('.')[0] === '21') { index = cont; }
                  cont = cont + 1
                })
                array.splice(index, 1)  
              }
              
            return array.map(maping => {
              return { style: maping.style, text: maping.text.split('.')[1] }
            })
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

  FuncionColumnas(columnas: number) {
    // console.log(columnas);
    let col = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']; 
    // console.log(col.slice(0,columnas));
    return col.slice(0, columnas);
  }

  FuncionTituloColumna(configuracion: IReporteAsistenciaConsolidada) {
    
    var arrayTitulos = [
      { text: 'Nº', style: 'tableHeader' },
      { colSpan: 4, text: 'ENTRADA', style: 'tableHeader' },
      { text: ''},
      { text: ''},
      { text: ''},
      { colSpan: 3, text: 'SALIDA A', style: 'tableHeader' },
      { text: ''},
      { text: ''},
      { colSpan: 3, text: 'ENTRADA A', style: 'tableHeader' },
      { text: ''},
      { text: ''},
      { colSpan: 3, text: 'SALIDA', style: 'tableHeader' },
      { text: ''},
      { text: ''},
      { text: 'ATRASO', style: 'tableHeader' },
      { text: 'SAL ANTES', style: 'tableHeader' },
      { text: 'ALMUE', style: 'tableHeader' },
      { text: 'HORA TRAB', style: 'tableHeader' },
      { text: 'HORA SUPL', style: 'tableHeader' },
      { text: 'HORA EX. L-V', style: 'tableHeader' },
      { text: 'HORA EX. S-D', style: 'tableHeader' },
    ]
    let index = 0;
    let contador = 0;
    if (configuracion.atraso === false) {   
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'ATRASO') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.salida_antes === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'SAL ANTES') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.almuerzo === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'ALMUE') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    } 
    
    if (configuracion.h_trab === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => { 
        if (obj.text === 'HORA TRAB') { index = contador;}
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.h_supl === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'HORA SUPL') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.h_ex_LV === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'HORA EX. L-V') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.h_ex_SD === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'HORA EX. S-D') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    // console.log(arrayTitulos);
    return arrayTitulos
  }

  FuncionColumnasTotal(columnas: number) {
    // console.log(columnas);
    // let col = ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
    let col = [17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
    // console.log(col.slice(0,columnas));
    return col.slice(0, columnas);
  }

  CampoOperaciones(objeto: any) {
    let columnas = parseInt(sessionStorage.getItem('columnasValidasAsistencia'));
    let s = JSON.parse( sessionStorage.getItem('arrayConfigAsistencia')) as IReporteAsistenciaConsolidada;
    // console.log(objeto);
    return {
      style: 'tableMargin',
      table: {
        widths: this.FuncionColumnasTotal(columnas),
        body: [
          this.FuncionTituloColumnaTotal(s),
          this.FuncionHHMMTotal(objeto.HHMM, s),
          this.FuncionDecimalTotal(objeto.decimal, s)
        ]
      }
    }
  }

  FuncionTituloColumnaTotal(configuracion: IReporteAsistenciaConsolidada) {
    
    var arrayTitulos = [
      { rowSpan: 3, colSpan: 14, text: 'TOTAL', style: 'tableTotal' },
      { text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''},
      { text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''},
      { text: ''}, { text: ''}, { text: ''},
      { text: 'ATRASO', style: 'tableHeader' },
      { text: 'SAL ANTES', style: 'tableHeader' },
      { text: 'ALMUE', style: 'tableHeader' },
      { text: 'HORA TRAB', style: 'tableHeader' },
      { text: 'HORA SUPL', style: 'tableHeader' },
      { text: 'HORA EX. L-V', style: 'tableHeader' },
      { text: 'HORA EX. S-D', style: 'tableHeader' }
    ]
    
    let index = 0;
    let contador = 0;
    if (configuracion.atraso === false) {   
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'ATRASO') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.salida_antes === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'SAL ANTES') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.almuerzo === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'ALMUE') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    } 
    
    if (configuracion.h_trab === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => { 
        if (obj.text === 'HORA TRAB') { index = contador;}
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.h_supl === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'HORA SUPL') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.h_ex_LV === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'HORA EX. L-V') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    
    if (configuracion.h_ex_SD === false) { 
      contador = 0;
      arrayTitulos.forEach(obj => {
        if (obj.text === 'HORA EX. S-D') { index = contador; }
        contador = contador + 1
      })
      arrayTitulos.splice(index, 1) 
    }
    // console.log(arrayTitulos);
    return arrayTitulos
  }

  FuncionHHMMTotal(obj: IRestTotalAsisteConsoli, configuracion: IReporteAsistenciaConsolidada) {
    var array = [
      { style: 'itemsTable', text: '1. '}, { style: 'itemsTable', text: '2. '}, { style: 'itemsTable', text: '3. '}, 
      { style: 'itemsTable', text: '4. '}, { style: 'itemsTable', text: '5. '}, { style: 'itemsTable', text: '6. '}, 
      { style: 'itemsTable', text: '7. '}, { style: 'itemsTable', text: '8. '}, { style: 'itemsTable', text: '9. '}, 
      { style: 'itemsTable', text: '10. '}, { style: 'itemsTable', text: '11. '}, { style: 'itemsTable', text: '12. '}, 
      { style: 'itemsTable', text: '13. '}, { style: 'itemsTable', text: '14. '},
      { style: 'itemsTable', text: '15.' + obj.atraso },
      { style: 'itemsTable', text: '16.' + obj.sal_antes },
      { style: 'itemsTable', text: '17.' + obj.almuerzo },
      { style: 'itemsTable', text: '18.' + obj.hora_trab },
      { style: 'itemsTable', text: '19.' + obj.hora_supl },
      { style: 'itemsTable', text: '20.' + obj.hora_ex_L_V },
      { style: 'itemsTable', text: '21.' + obj.hora_ex_S_D },
    ]
    let index = 0;
    let cont = 0;
      if (configuracion.atraso === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '15') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1) 
      }
      
      if (configuracion.salida_antes === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '16') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }
      
      if (configuracion.almuerzo === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '17') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1) 
      } 
      
      if (configuracion.h_trab === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '18') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1) 
      }
      
      if (configuracion.h_supl === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '19') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }
      
      if (configuracion.h_ex_LV === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '20') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }
      
      if (configuracion.h_ex_SD === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('.')[0] === '21') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }

    return array.map(maping => {
      return { style: maping.style, text: maping.text.split('.')[1] }
    })
  }

  FuncionDecimalTotal(obj: IRestTotalAsisteConsoli, configuracion: IReporteAsistenciaConsolidada) {
    var array = [
      { text: '1- ', style: 'itemsTable' }, { text: '2- ', style: 'itemsTable' }, { text: '3- ', style: 'itemsTable' }, 
      { text: '4- ', style: 'itemsTable' }, { text: '5- ', style: 'itemsTable' }, { text: '6- ', style: 'itemsTable' }, 
      { text: '7- ', style: 'itemsTable' }, { text: '8- ', style: 'itemsTable' }, { text: '9- ', style: 'itemsTable' }, 
      { text: '10- ', style: 'itemsTable' }, { text: '11- ', style: 'itemsTable' }, { text: '12- ', style: 'itemsTable' }, 
      { text: '13- ', style: 'itemsTable' }, { text: '14- ', style: 'itemsTable' },
      { text: '15-' + obj.atraso.toString().slice(0, 8), style: 'itemsTable' },
      { text: '16-' + obj.sal_antes.toString().slice(0, 8), style: 'itemsTable' },
      { text: '17-' + obj.almuerzo.toString().slice(0, 8), style: 'itemsTable' },
      { text: '18-' + obj.hora_trab.toString().slice(0, 8), style: 'itemsTable' },
      { text: '19-' + obj.hora_supl.toString().slice(0, 8), style: 'itemsTable' },
      { text: '20-' + obj.hora_ex_L_V.toString().slice(0, 8), style: 'itemsTable' },
      { text: '21-' + obj.hora_ex_S_D.toString().slice(0, 8), style: 'itemsTable' },
    ]
    let index = 0;
    let cont = 0;
      if (configuracion.atraso === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '15') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1) 
      }
      
      if (configuracion.salida_antes === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '16') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }
      
      if (configuracion.almuerzo === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '17') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1) 
      } 
      
      if (configuracion.h_trab === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '18') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1) 
      }
      
      if (configuracion.h_supl === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '19') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }
      
      if (configuracion.h_ex_LV === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '20') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }
      
      if (configuracion.h_ex_SD === false) { 
        cont = 0;
        array.forEach(ele => {
          if (ele.text.split('-')[0] === '21') { index = cont; }
          cont = cont + 1
        })
        array.splice(index, 1)  
      }

    return array.map(maping => {
      return { style: maping.style, text: maping.text.split('-')[1] }
    })
  }

  /****************************************************************************************************** 
   *                                       MÉTODO PARA EXPORTAR A EXCEL
   ******************************************************************************************************/
  exportToExcelAsistencia(id_empleado: number) {
    this.asistencia = [];
    this.restKardex.ReporteAsistenciaDetalleConsolidado(id_empleado, '2020-08-01', '2020-08-31').subscribe(res => {
      console.log(this.asistencia);
        if(res.message) {
          this.toastr.error(res.message,'', {
            timeOut: 6000,
          });
        } else {
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
          
        }
      
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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
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