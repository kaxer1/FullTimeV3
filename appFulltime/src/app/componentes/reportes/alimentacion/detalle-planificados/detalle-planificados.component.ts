import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Librería para formato de fechas
import * as moment from 'moment';
moment.locale('es');
// Librería para generar archivos PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// Librería para generar archivos EXCEL
import * as xlsx from 'xlsx';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorasExtrasRealesService } from 'src/app/servicios/reportes/horasExtrasReales/horas-extras-reales.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { DatosGeneralesService } from 'src/app/servicios/datosGenerales/datos-generales.service';
import { AlimentacionService } from 'src/app/servicios/reportes/alimentacion/alimentacion.service';
import { ValidacionesService } from '../../../../servicios/validaciones/validaciones.service';

@Component({
  selector: 'app-detalle-planificados',
  templateUrl: './detalle-planificados.component.html',
  styleUrls: ['./detalle-planificados.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class DetallePlanificadosComponent implements OnInit {

  // Datos del Empleado Timbre
  empleado: any = [];

  // Arreglo datos del empleado
  datosEmpleado: any = [];

  // Datos del Formulario de búsqueda
  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  apellido = new FormControl('', [Validators.minLength(2)]);
  departamentoF = new FormControl('', [Validators.minLength(2)]);
  regimenF = new FormControl('', [Validators.minLength(2)]);
  cargoF = new FormControl('', [Validators.minLength(2)]);

  // Datos del Formulario de Periodo
  fechaInicialF = new FormControl('', [Validators.required]);
  fechaFinalF = new FormControl('', [Validators.required]);

  // Formulario de Periodo
  public fechasForm = new FormGroup({
    inicioForm: this.fechaInicialF,
    finalForm: this.fechaFinalF,
  });

  // Datos de filtros de búsqueda
  filtroCodigo: number;
  filtroCedula: '';
  filtroNombre: '';
  filtroApellido: '';
  filtroDepartamento: '';
  filtroRegimen: '';
  filtroCargo: '';

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Datos del empleado Logueado
  empleadoLogueado: any = [];
  idEmpleado: number;

  constructor(
    public rest: EmpleadoService,
    public restH: HorasExtrasRealesService,
    public restR: ReportesService,
    public restEmpre: EmpresaService,
    public restD: DatosGeneralesService,
    public restA: AlimentacionService,
    public router: Router,
    private toastr: ToastrService,
    private validacionesService: ValidacionesService
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleadoLogueado(this.idEmpleado);
    this.VerDatosEmpleado();
    this.ObtenerLogo();
    this.ObtnerColores();
  }

  // Método para ver la información del empleado 
  ObtenerEmpleadoLogueado(idemploy: any) {
    this.empleadoLogueado = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoLogueado = data;
      console.log('emple', this.empleadoLogueado)
    })
  }

  // Método para obtener el logo de la empresa
  logo: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logo = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  // Método para obtener colores de empresa
  p_color: any;
  s_color: any;
  empresa: any;
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
      this.empresa = res[0].nombre;
    });
  }

  // Evento para manejar la páginación
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Lista de datos de empleados
  VerDatosEmpleado() {
    this.datosEmpleado = [];
    this.restD.ListarInformacionActual().subscribe(data => {
      this.datosEmpleado = data;
      console.log('datos_actuales', this.datosEmpleado)
    });
  }

  // Control para verificar ingreso de fechas
  timbres: any = [];
  planificados: any = [];
  solicitados: any = [];
  extras: any = [];
  inicio: any;
  fin: any;
  VerFechas(form, archivo) {
    if (Date.parse(form.inicioForm) <= Date.parse(form.finalForm)) {
      let fechas = {
        fec_inicio: form.inicioForm,
        fec_final: form.finalForm
      }
      this.inicio = moment(form.inicioForm).format('YYYY-MM-DD');
      this.fin = moment(form.finalForm).format('YYYY-MM-DD');
      console.log('fechas', moment(this.inicio).format('YYYY-MM-DD'), this.fin)
      // Limpiar array de datos
      this.planificados = [];
      this.solicitados = [];
      this.extras = [];
      // 1. Buscamos registros de servicios planificados
      this.restA.ObtenerDetallesPlanificadosConsumidos(fechas).subscribe(plan => {
        this.planificados = plan;
        // 2. Buscamos registros de servicios solicitados
        this.restA.ObtenerDetallesSolicitadosConsumidos(fechas).subscribe(sol => {
          this.solicitados = sol;
          // 3. Método de búsqueda de registros de servicios extras 
          this.ObtenerExtrasConsumidos(fechas, archivo, form);
        }, err => {
          // 4. Método de búsqueda de registros de servicios extras 
          this.ObtenerExtrasConsumidos(fechas, archivo, form);
          return this.validacionesService.RedireccionarHomeAdmin(err.error)
        });
      }, err => {
        // 5. Buscamos registros de servicios solicitados
        this.restA.ObtenerDetallesSolicitadosConsumidos(fechas).subscribe(sol => {
          this.solicitados = sol;
          // 6. Método de búsqueda de registros de servicios extras 
          this.ObtenerExtrasConsumidos(fechas, archivo, form);
        }, err => {
          // 7. Método de búsqueda de registros de servicios extras 
          this.ObtenerExtrasConsumidos(fechas, archivo, form);
          return this.validacionesService.RedireccionarHomeAdmin(err.error)
        });

        return this.validacionesService.RedireccionarHomeAdmin(err.error)
      });
    }
    else {
      this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR', {
        timeOut: 6000,
      });
    }
  }

  // Método de búsqueda de registros de servicios extras
  ObtenerExtrasConsumidos(fecha, archivo, form) {
    // 1. Búsqueda de servicios extras planificados
    this.restA.ObtenerDetallesExtrasPlanConsumidos(fecha).subscribe(plan => {
      this.extras = plan;
      console.log('comidas 1', this.extras);
      // 2. Búsqueda de servicios extras solicitados
      this.restA.ObtenerDetallesExtrasSolConsumidos(fecha).subscribe(sol => {
        this.extras = this.extras.concat(sol);
        console.log('comidas 2', this.extras);
        // Llamado a método de impresión de archivos
        this.ImprimirArchivo(archivo, form);
      }, err => {
        // Llamado a método de impresión de archivos
        this.ImprimirArchivo(archivo, form);
        return this.validacionesService.RedireccionarHomeAdmin(err.error)
      });
    }, err => {
      // 3. Búsqueda de servicios extras solicitados
      this.restA.ObtenerDetallesExtrasSolConsumidos(fecha).subscribe(sol2 => {
        this.extras = sol2;
        console.log('comidas 3', this.extras);
        // Llamado a método de impresión de archivos
        this.ImprimirArchivo(archivo, form);
      }, err => {
        // Revisamos si todos los datos son vacios
        if (this.planificados.length === 0 && this.solicitados.length === 0 && this.extras.length === 0) {
          // Mensaje indicando que no existen registros
          this.toastr.info('No existen registros en el periodo indicado.', 'Dar click aquí, para obtener reporte, en el que se indica que no existen registros.', {
            timeOut: 10000,
          }).onTap.subscribe(obj => {
            // Llamado a método de impresión de archivo sin registros
            this.generarPdf('open');
            this.LimpiarFechas();
          });
        }
        else {
          // Llamado a método de impresión de archivos
          this.ImprimirArchivo(archivo, form);
        }
        
        return this.validacionesService.RedireccionarHomeAdmin(err.error)
      });

      return this.validacionesService.RedireccionarHomeAdmin(err.error)
    });
  }

  ImprimirArchivo(archivo: string, form) {
    if (archivo === 'pdf') {
      this.generarPdf('open');
      this.LimpiarFechas();
    }
    else if (archivo === 'excel') {
      this.exportToExcelAlimentacion(form);
      this.LimpiarFechas();
    }
  }

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

  LimpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
    this.departamentoF.reset();
    this.regimenF.reset();
    this.cargoF.reset();
  }

  LimpiarFechas() {
    this.fechaInicialF.reset();
    this.fechaFinalF.reset();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

  generarPdf(action = 'open') {
    if (this.planificados.length === 0 && this.solicitados.length === 0 && this.extras.length === 0) {
      const documentDefinition_ = this.GenerarSinRegstros();
      switch (action) {
        case 'open': pdfMake.createPdf(documentDefinition_).open(); break;
        case 'print': pdfMake.createPdf(documentDefinition_).print(); break;
        case 'download': pdfMake.createPdf(documentDefinition_).download(); break;

        default: pdfMake.createPdf(documentDefinition_).open(); break;
      }
    }
    else {
      const documentDefinition = this.getDocumentDefinicion();
      switch (action) {
        case 'open': pdfMake.createPdf(documentDefinition).open(); break;
        case 'print': pdfMake.createPdf(documentDefinition).print(); break;
        case 'download': pdfMake.createPdf(documentDefinition).download(); break;

        default: pdfMake.createPdf(documentDefinition).open(); break;
      }
    }
  }

  getDocumentDefinicion() {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);
    return {
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // Pie de la página
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // Formato de hora actual
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            {
              text: [{
                text: 'Fecha: ' + fecha + ' Hora: ' + time,
                alignment: 'left', opacity: 0.3
              }]
            },
            {
              text: [{
                text: '© Pag ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', opacity: 0.3
              }],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },

        { text: this.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
        { text: 'REPORTE ALIMENTOS CONSUMIDOS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
        this.presentarEncabezado('TOTAL DE ALIMENTOS PLANIFICADOS CONSUMIDOS'),
        this.presentarAlimentacion(this.planificados),
        this.presentarTotales(this.planificados),
        this.presentarEspacio(),
        this.presentarEncabezado('TOTAL DE ALIMENTOS SOLICITADOS CONSUMIDOS'),
        this.presentarAlimentacion(this.solicitados),
        this.presentarTotales(this.solicitados),
        this.presentarEspacio(),
        this.presentarEncabezado('TOTAL DE ALIMENTOS EXTRAS CONSUMIDOS'),
        this.presentarAlimentacion(this.extras),
        this.presentarTotales(this.extras),
        this.presentarEspacio(),
        this.presentarSumatoriaTotal(this.planificados, this.solicitados, this.extras),
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'center' },
        itemsTableT: { fontSize: 10, alignment: 'center', bold: true },
        centrado: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, margin: [0, 5, 0, 5] },
        ver: { fontSize: 10, bold: true, alignment: 'center', border: false }
      }
    };
  }

  presentarEncabezado(titulo: any) {
    return {
      table: {
        widths: ['*'],
        body: [
          [{ text: titulo, style: 'tableHeader' },],
          [{
            columns: [
              { text: [{ text: 'FECHA INICIO: ' + this.inicio, style: 'itemsTableI' }] },
              { text: [{ text: 'FECHA FIN: ' + this.fin, style: 'itemsTableI' }] },
            ]
          }],
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        paddingLeft: function (i, node) { return 40; },
        paddingRight: function (i, node) { return 40; },
        paddingTop: function (i, node) { return 6; },
        paddingBottom: function (i, node) { return 6; }
      }
    }
  }

  presentarEspacio() {
    return {
      table: {
        widths: ['*'],
        body: [
          [{ text: '', style: 'ver', margin: [0, 5, 0, 5] },],
        ]
      },
      layout:
        'noBorders'
    }
  }

  presentarTotales(arreglo: any) {
    var t_cantida = 0, t_costo = 0, t_total = 0;
    arreglo.forEach(obj => {
      t_cantida = t_cantida + parseInt(obj.cantidad),
        t_costo = t_costo + parseFloat(obj.valor),
        t_total = t_total + parseFloat(obj.total)
    })
    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
        body: [
          [
            { colSpan: 7, text: 'TOTAL: ', style: 'itemsTableT', fillColor: this.s_color },
            '', '', '', '', '', '',
            { text: t_cantida, style: 'itemsTableT', fillColor: this.s_color },
            { text: '$ ' + t_costo.toFixed(2), style: 'itemsTableT', fillColor: this.s_color },
            { text: '$ ' + t_total.toFixed(2), style: 'itemsTableT', fillColor: this.s_color },
          ]
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        paddingLeft: function (i, node) { return 20; },
        paddingRight: function (i, node) { return 20; },
        paddingTop: function (i, node) { return 6; },
        paddingBottom: function (i, node) { return 6; }
      }
    }
  }

  presentarSumatoriaTotal(arreglo1: any, arreglo2: any, arreglo3: any) {
    var t_total1 = 0;
    var t_total2 = 0;
    var t_total3 = 0;
    var suma_total = 0;
    arreglo1.forEach(obj1 => {
      t_total1 = t_total1 + parseFloat(obj1.total)
    })
    arreglo2.forEach(obj2 => {
      t_total2 = t_total2 + parseFloat(obj2.total)
    })
    arreglo3.forEach(obj3 => {
      t_total3 = t_total3 + parseFloat(obj3.total)
    })
    suma_total = t_total1 + t_total2 + t_total3;
    console.log('totales', t_total1, ' ', t_total2, ' ', t_total3, ' ', suma_total)
    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
        body: [
          [
            { colSpan: 9, text: 'SUMATORIA TOTAL DE ALIMENTOS CONSUMIDOS: ', style: 'itemsTableT', fillColor: this.s_color, fontSize: 12 },
            '', '', '', '', '', '', '', '',
            { text: '$ ' + suma_total.toFixed(2), style: 'itemsTableT', fillColor: this.s_color, fontSize: 11 }
          ]
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        paddingLeft: function (i, node) { return 20; },
        paddingRight: function (i, node) { return 20; },
        paddingTop: function (i, node) { return 6; },
        paddingBottom: function (i, node) { return 6; }
      }
    }
  }

  accionT: string;
  contarRegistros: number = 0;
  presentarAlimentacion(arreglo: any) {
    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*', 'auto', '*', '*', '*'],
        body: [
          [
            { text: 'TICKET', style: 'centrado' },
            { text: 'EMPLEADO', style: 'centrado' },
            { text: 'CÉDULA', style: 'centrado' },
            { text: 'TIPO COMIDA', style: 'centrado' },
            { text: 'MENÚ', style: 'centrado' },
            { text: 'PLATO', style: 'centrado' },
            { text: 'DESCRIPCIÓN', style: 'centrado' },
            { text: 'CANTIDAD', style: 'centrado' },
            { text: 'COSTO', style: 'centrado' },
            { text: 'COSTO TOTAL', style: 'centrado' },
          ],
          ...arreglo.map(obj => {
            return [
              { text: '', style: 'itemsTableD' },
              { text: obj.apellido + ' ' + obj.nombre, style: 'itemsTableD' },
              { text: obj.cedula, style: 'itemsTableD' },
              { text: obj.comida_tipo, style: 'itemsTableD' },
              { text: obj.menu, style: 'itemsTableD' },
              { text: obj.plato, style: 'itemsTableD' },
              { text: obj.observacion, style: 'itemsTableD' },
              { text: obj.cantidad, style: 'itemsTableD' },
              { text: '$ ' + obj.valor, style: 'itemsTableD' },
              { text: '$ ' + obj.total.toFixed(2), style: 'itemsTableD' },
            ];
          })
        ]
      },
      // Estilo de colores formato zebra
      layout: {
        fillColor: function (i, node) {
          return (i % 2 === 0) ? '#CCD1D1' : null;
        }
      }
    };
  }

  /** GENERACIÓN DE PDF AL NO CONTAR CON REGISTROS */
  GenerarSinRegstros() {

    sessionStorage.setItem('Administrador', this.empleadoLogueado);

    return {

      // Encabezado de la página
      //pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de la página
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // Formato de hora actual
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            {
              text: [{
                text: 'Fecha: ' + fecha + ' Hora: ' + time,
                alignment: 'left', opacity: 0.3
              }]
            },
            {
              text: [{
                text: '© Pag ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', opacity: 0.3
              }],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: this.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
        { text: 'REPORTE ALIMENTOS CONSUMIDOS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
        this.presentarEspacio(),
        {
          text: [{ text: 'FECHA INICIO: ' + this.inicio, alignment: 'center', margin: [0, 0, 0, 5] },
          { text: '   -   FECHA FIN: ' + this.fin, alignment: 'center', margin: [0, 0, 0, 5] }]
        },
        this.presentarEspacio(),
        { text: 'NO EXISTEN REGISTROS DE SERVICIOS DE ALIMENTACIÓN', fontSize: 15, alignment: 'center', margin: [0, 0, 0, 10] },
      ],
    };
  }

  /****************************************************************************************************** 
     *                                       MÉTODO PARA EXPORTAR A EXCEL
     ******************************************************************************************************/
  exportToExcelAlimentacion(form) {
    var j = 0;
    const wsp: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.planificados.map(obj => {
      return {
        N_REGISTROS: j = j + 1,
        TICKET: '',
        CEDULA: obj.cedula,
        EMPLEADO: obj.apellido + ' ' + obj.nombre,
        TIPO_COMIDA: obj.comida_tipo,
        MENU: obj.menu,
        PLATO: obj.plato,
        DESCRIPCION: obj.observacion,
        CANTIDAD: parseInt(obj.cantidad),
        COSTO: obj.valor,
        COSTO_TOTAL: obj.total,
      }
    }));
    if (this.planificados.length != 0) {
      const header = Object.keys(this.planificados[0]); // columns name
      var wscols = [];
      for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wpx: 110 })
      }
      wsp["!cols"] = wscols;
    }

    var i = 0;
    const wss: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.solicitados.map(obj => {
      return {
        N_REGISTROS: i = i + 1,
        TICKET: '',
        CEDULA: obj.cedula,
        EMPLEADO: obj.apellido + ' ' + obj.nombre,
        TIPO_COMIDA: obj.comida_tipo,
        MENU: obj.menu,
        PLATO: obj.plato,
        DESCRIPCION: obj.observacion,
        CANTIDAD: parseInt(obj.cantidad),
        COSTO: obj.valor,
        COSTO_TOTAL: obj.total,
      }
    }));
    if (this.solicitados.length != 0) {
      const header2 = Object.keys(this.solicitados[0]); // columns name
      var wscols2 = [];
      for (var i = 0; i < header2.length; i++) {  // columns length added
        wscols2.push({ wpx: 110 })
      }
      wss["!cols"] = wscols2;
    }

    var k = 0;
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.extras.map(obj => {
      return {
        N_REGISTROS: k = k + 1,
        TICKET: '',
        CEDULA: obj.cedula,
        EMPLEADO: obj.apellido + ' ' + obj.nombre,
        TIPO_COMIDA: obj.comida_tipo,
        MENU: obj.menu,
        PLATO: obj.plato,
        DESCRIPCION: obj.observacion,
        CANTIDAD: parseInt(obj.cantidad),
        COSTO: obj.valor,
        COSTO_TOTAL: obj.total,
      }
    }));
    if (this.extras.length != 0) {
      const header3 = Object.keys(this.extras[0]); // columns name
      var wscols3 = [];
      for (var i = 0; i < header3.length; i++) {  // columns length added
        wscols3.push({ wpx: 110 })
      }
      wse["!cols"] = wscols3;
    }

    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    if (this.planificados.length != 0) {
      xlsx.utils.book_append_sheet(wb, wsp, 'Alimentos Planificados');
    }
    if (this.solicitados.length != 0) {
      xlsx.utils.book_append_sheet(wb, wss, 'Alimentos Solicitados');
    }
    if (this.extras.length != 0) {
      xlsx.utils.book_append_sheet(wb, wse, 'Alimentos Extras');
    }
    xlsx.writeFile(wb, "Alimentacion - " + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' - ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + '.xlsx');
  }

}
