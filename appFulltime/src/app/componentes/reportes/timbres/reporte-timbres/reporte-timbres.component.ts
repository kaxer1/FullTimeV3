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

// Servicios Filtros de búsqueda
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';
import { ValidacionesService } from '../../../../servicios/validaciones/validaciones.service';

@Component({
  selector: 'app-reporte-timbres',
  templateUrl: './reporte-timbres.component.html',
  styleUrls: ['./reporte-timbres.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class ReporteTimbresComponent implements OnInit {

  // Datos del Empleado Timbre
  empleado: any = [];


  // Arreglo datos del empleado
  datosEmpleado: any = [];

  // Datos del Formulario de búsqueda
  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
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
  filtroEmpleado = '';
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


  /**FILTROS DE BÚSQUEDA */
  sucursalF = new FormControl('');
  depaF = new FormControl('');
  cargosF = new FormControl('');
  laboralF = new FormControl('');
  // Formulario de Búsquedas
  public busquedasForm = new FormGroup({
    sucursalForm: this.sucursalF,
    depaForm: this.depaF,
    cargosForm: this.cargosF,
    laboralForm: this.laboralF,
  });

  constructor(
    /** FILTROS DE BÚSQUEDA */
    public restSucur: SucursalService,
    public restDepa: DepartamentosService,
    public restCargo: EmplCargosService,
    public restRegimen: RegimenService,

    public rest: EmpleadoService,
    public restH: HorasExtrasRealesService,
    public restR: ReportesService,
    public restEmpre: EmpresaService,
    public restD: DatosGeneralesService,
    public router: Router,
    private toastr: ToastrService,
    private validaciones: ValidacionesService
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleadoLogueado(this.idEmpleado);
    this.VerDatosEmpleado();
    this.ObtenerLogo();
    this.ObtenerColores();

    //FILTROS DE BÚSQUEDA
    this.ListarSucursales();
    this.ListarDepartamentos();
    this.ListarCargos();
    this.ListarRegimen();
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

  // MÉTODO PARA OBTENER COLORES Y MARCA DE AGUA DE EMPRESA 
  p_color: any;
  s_color: any;
  frase: any;
  ObtenerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
      this.frase = res[0].marca_agua;
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
  VerTimbresEmpleado(id_seleccionado, form, archivo) {
    if (form.inicioForm === '' || form.finalForm === '') {
      this.toastr.info('Ingresar fechas de periodo de búsqueda.', 'VERIFICAR DATOS DE FECHA', {
        timeOut: 6000,
      })
    }
    else {
      if (Date.parse(form.inicioForm) <= Date.parse(form.finalForm)) {
        let fechas = {
          fechaInicio: form.inicioForm,
          fechaFinal: form.finalForm
        }
        this.timbres = [];
        this.restR.ObtenerTimbres(id_seleccionado, fechas).subscribe(data => {
          this.timbres = data;
          console.log('Datos timbres: ', this.timbres);
          if (archivo === 'pdf') {
            this.generarPdf('open', id_seleccionado, form);
            this.LimpiarFechas();
          }
          else if (archivo === 'excel') {
            this.exportToExcelTimbres(id_seleccionado, form);
            this.LimpiarFechas();
          }
        }, error => {
          this.toastr.info('En el periodo indicado el empleado no tiene registros de Timbres.', 'Dar click aquí, para obtener reporte, en el que se indica que no existen registros.', {
            timeOut: 10000,
          }).onTap.subscribe(obj => {
            if (archivo === 'pdf') {
              this.PDF_Vacio('open', id_seleccionado, form);
              this.LimpiarFechas();
            }
          });
        }
        );
      }
      else {
        this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR', {
          timeOut: 6000,
        });
      }
    }

  }

  IngresarSoloLetras(e) {
    return this.validaciones.IngresarSoloLetras(e)
  }

  IngresarSoloNumeros(evt) {
    return this.validaciones.IngresarSoloNumeros(evt)
  }

  LimpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.departamentoF.reset();
    this.regimenF.reset();
    this.cargoF.reset();
    this.filtroEmpleado = '';
  }

  LimpiarFechas() {
    this.fechaInicialF.reset();
    this.fechaFinalF.reset();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

  generarPdf(action = 'open', id_seleccionado, form) {
    const documentDefinition = this.getDocumentDefinicion(id_seleccionado, form);

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion(id_seleccionado: number, form) {

    sessionStorage.setItem('Administrador', this.empleadoLogueado);

    return {

      // Encabezado de la página
      //pageOrientation: 'landscape',
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de la página
      footer: function (currentPage: any, pageCount: any, fecha: any, hora: any) {
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
        ...this.datosEmpleado.map(obj => {
          console.log(obj);
          
          if (obj.codigo === id_seleccionado) {
            return [
              { text: obj.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
              { text: 'REPORTE TIMBRES', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
            ];
          }
        }),
        this.presentarDatosGenerales(id_seleccionado, form),
        this.presentarTimbres(),
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTableP: { fontSize: 9, alignment: 'left', bold: true, margin: [50, 5, 5, 5] },
        centrado: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, margin: [0, 10, 0, 10] }
      }
    };
  }

  presentarDatosGenerales(id_seleccionado, form) {
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo, regimen;
    this.datosEmpleado.forEach(obj => {
      if (obj.codigo === id_seleccionado) {
        nombre = obj.nombre;
        apellido = obj.apellido;
        cedula = obj.cedula;
        codigo = obj.codigo;
        sucursal = obj.sucursal;
        departamento = obj.departamento;
        ciudad = obj.ciudad;
        cargo = obj.cargo;
        regimen = obj.regimen
      }
    })
    var diaI = moment(form.inicioForm).day();
    var diaF = moment(form.finalForm).day();
    return {
      table: {
        widths: ['*'],
        body: [
          [{ text: 'INFORMACIÓN GENERAL EMPLEADO', style: 'tableHeader' },],
          [{
            columns: [
              { text: [{ text: 'CIUDAD: ' + ciudad, style: 'itemsTableI' }] },
              { text: [{ text: 'PERIODO DEL: ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableP' }] },
              { text: [{ text: '', style: 'itemsTableI' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'APELLIDOS: ' + apellido, style: 'itemsTableI' }] },
              { text: [{ text: 'NOMBRES: ' + nombre, style: 'itemsTableI' }] },
              { text: [{ text: 'CÉDULA: ' + cedula, style: 'itemsTableI' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'CÓDIGO: ' + codigo, style: 'itemsTableI' }] },
              { text: [{ text: 'CARGO: ' + cargo, style: 'itemsTableI' }] },
              { text: [{ text: 'REGIMEN LABORAL: ' + regimen, style: 'itemsTableI' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'SUCURSAL: ' + sucursal, style: 'itemsTableI' }] },
              { text: [{ text: 'DEPARTAMENTO: ' + departamento, style: 'itemsTableI' }] },
              { text: [{ text: 'N° REGISTROS: ' + this.timbres.length, style: 'itemsTableI' }] },
            ]
          }],
          [{ text: 'LISTA DE TIMBRES PERIODO DEL ' + moment.weekdays(diaI).toUpperCase() + ' ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + moment.weekdays(diaF).toUpperCase() + ' ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'tableHeader' },],
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        paddingLeft: function (i, node) { return 40; },
        paddingRight: function (i, node) { return 40; },
        paddingTop: function (i, node) { return 10; },
        paddingBottom: function (i, node) { return 10; }
      }
    }
  }

  accionT: string;
  contarRegistros: number = 0;
  presentarTimbres() {
    this.contarRegistros = 0;
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { rowSpan: 2, text: 'N. REGISTRO', style: 'centrado' },
            { colSpan: 3, text: 'TIMBRE', style: 'tableHeader', fillColor: this.s_color },
            '', '',
            { rowSpan: 2, text: 'RELOJ', style: 'centrado' },
            { rowSpan: 2, text: 'ACCIÓN', style: 'centrado' },
            { rowSpan: 2, text: 'OBSERVACIÓN', style: 'centrado' },
          ],
          [
            '',
            { text: 'DÍA', style: 'tableHeader' },
            { text: 'FECHA', style: 'tableHeader' },
            { text: 'HORA', style: 'tableHeader' },
            '', '', ''
          ],
          ...this.timbres.map(obj => {
            switch (obj.accion) {
              case 'EoS': this.accionT = 'Entrada o Salida'; break;
              case 'AES': this.accionT = 'Entrada o Salida Almuerzo'; break;
              case 'PES': this.accionT = 'Entrada o Salida Permiso'; break;
              case 'E': this.accionT = 'Entrada'; break;
              case 'S': this.accionT = 'Salida'; break;
              case 'E/A': this.accionT = 'Entrada Almuerzo'; break;
              case 'S/A': this.accionT = 'Salida Almuerzo'; break;
              case 'E/P': this.accionT = 'Entrada Permiso'; break;
              case 'S/P': this.accionT = 'Salida Permiso'; break;
              default: this.accionT = 'codigo 99'; break;
            }
            var day = moment(obj.fec_hora_timbre).day()

            this.contarRegistros = this.contarRegistros + 1;

            return [
              { text: this.contarRegistros, style: 'itemsTableD' },
              { text: moment.weekdays(day).charAt(0).toUpperCase() + moment.weekdays(day).slice(1), style: 'itemsTableD' },
              { text: moment(obj.fec_hora_timbre).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: moment(obj.fec_hora_timbre).format('HH:mm:ss'), style: 'itemsTableD' },
              { text: obj.id_reloj, style: 'itemsTableD' },
              { text: this.accionT, style: 'itemsTableD' },
              { text: obj.observacion, style: 'itemsTableD' },
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

  PDF_Vacio(action = 'open', id_seleccionado, form) {
    const documentDefinition = this.GenerarSinRegstros(id_seleccionado, form);

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  GenerarSinRegstros(id_seleccionado: any, form) {

    sessionStorage.setItem('Administrador', this.empleadoLogueado);

    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de la página
      footer: function (currentPage: any, pageCount: any, fecha: any, hora: any) {
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
        ...this.datosEmpleado.map(obj => {
          if (obj.codigo === id_seleccionado) {
            return [
              { text: obj.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
              { text: 'REPORTE TIMBRES', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
            ];
          }
        }),
        this.presentarDatosEmpleado(id_seleccionado, form)
      ],
      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTableP: { fontSize: 9, alignment: 'left', bold: true, margin: [50, 5, 5, 5] },
      }
    };
  }

  // Datos generales del PDF y sumatoria total de calculos realizados
  presentarDatosEmpleado(id_seleccionado, form) {
    // Inicialización de varibles
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo, regimen;
    // Búsqueda de los datos del empleado del cual se obtiene el reporte
    this.datosEmpleado.forEach(obj => {
      if (obj.codigo === id_seleccionado) {
        nombre = obj.nombre;
        apellido = obj.apellido;
        cedula = obj.cedula;
        codigo = obj.codigo;
        sucursal = obj.sucursal;
        departamento = obj.departamento;
        ciudad = obj.ciudad;
        cargo = obj.cargo;
        regimen = obj.regimen;
      }
    });

    // Estructura de la tabla de lista de registros
    return {
      table: {
        widths: ['*'],
        body: [
          [{ text: 'INFORMACIÓN GENERAL EMPLEADO', style: 'tableHeader' },],
          [{
            columns: [
              { text: [{ text: 'PERIODO DEL: ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableP' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'APELLIDOS: ' + apellido, style: 'itemsTableI' }] },
              { text: [{ text: 'NOMBRES: ' + nombre, style: 'itemsTableI' }] },
              { text: [{ text: 'CÉDULA: ' + cedula, style: 'itemsTableI' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'CÓDIGO: ' + codigo, style: 'itemsTableI' }] },
              { text: [{ text: 'CARGO: ' + cargo, style: 'itemsTableI' }] },
              { text: [{ text: 'REGIMEN LABORAL: ' + regimen, style: 'itemsTableI' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'CIUDAD: ' + ciudad, style: 'itemsTableI' }] },
              { text: [{ text: 'SUCURSAL: ' + sucursal, style: 'itemsTableI' }] },
              { text: [{ text: 'DEPARTAMENTO: ' + departamento, style: 'itemsTableI' }] },
            ]
          }],
          [{ text: 'NO EXISTEN REGISTROS DE TIMBRES', style: 'tableHeader' },],
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        paddingLeft: function (i, node) { return 40; },
        paddingRight: function (i, node) { return 40; },
        paddingTop: function (i, node) { return 10; },
        paddingBottom: function (i, node) { return 10; }
      }
    }
  }

  /****************************************************************************************************** 
    *                                       MÉTODO PARA EXPORTAR A EXCEL
    ******************************************************************************************************/
  exportToExcelTimbres(id_empleado: number, form) {
    var j = 0;
    for (var i = 0; i <= this.datosEmpleado.length - 1; i++) {
      if (this.datosEmpleado[i].codigo === id_empleado) {
        var datosEmpleado = [{
          CODIGO: this.datosEmpleado[i].codigo,
          NOMBRE: this.datosEmpleado[i].nombre,
          APELLIDO: this.datosEmpleado[i].apellido,
          CEDULA: this.datosEmpleado[i].cedula,
          SUCURSAL: this.datosEmpleado[i].sucursal,
          DEPARTAMENTO: this.datosEmpleado[i].departamento,
          CIUDAD: this.datosEmpleado[i].ciudad,
          CARGO: this.datosEmpleado[i].cargo,
          REGIMEN: this.datosEmpleado[i].regimen
        }]
        break;
      }
    }
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datosEmpleado);

    const headerE = Object.keys(datosEmpleado[0]); // columns name

    var wscolsE = [];
    for (var i = 0; i < headerE.length; i++) {  // columns length added
      wscolsE.push({ wpx: 110 })
    }
    wse["!cols"] = wscolsE;

    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.timbres.map(obj => {
      if (obj.accion === 'E' || obj.accion === '1') {
        this.accionT = 'Entrada';
      }
      else if (obj.accion === 'S' || obj.accion === '2') {
        this.accionT = 'Salida';
      }
      else if (obj.accion === 'EA' || obj.accion === '3') {
        this.accionT = 'Entrada Almuerzo';
      }
      else if (obj.accion === 'SA' || obj.accion === '4') {
        this.accionT = 'Salida Almuerzo';
      }
      else if (obj.accion === 'EP' || obj.accion === '5') {
        this.accionT = 'Entrada Permiso';
      }
      else if (obj.accion === 'SP' || obj.accion === '6') {
        this.accionT = 'Salida Permiso';
      }
      var day = moment(obj.fec_hora_timbre).day()
      return {
        N_REGISTROS: j = j + 1,
        DIA_TIMBRE: moment.weekdays(day).charAt(0).toUpperCase() + moment.weekdays(day).slice(1),
        FECHA_TIMBRE: moment(obj.fec_hora_timbre).format('DD/MM/YYYY'),
        HORA_TIMBRE: moment(obj.fec_hora_timbre).format('HH:mm:ss'),
        ID_RELOJ: obj.id_reloj,
        ACCION: this.accionT,
        OBSERVACION: obj.observacion,
      }
    }));

    const header = Object.keys(this.timbres[0]); // columns name

    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
      wscols.push({ wpx: 110 })
    }
    wst["!cols"] = wscols;

    /* wse["!A1"] = {
       fill: {
         patternType: "none", // none / solid
         fgColor: { rgb: "FFFFAA00" },
         bgColor: { rgb: "FFFFFFFF" }
       },
       font: {
         name: 'Times New Roman',
         sz: 16,
         color: { rgb: "#FF000000" },
         bold: true,
         italic: false,
         underline: false
       },
       border: {
         top: { style: "thin", color: { auto: 1 } },
         right: { style: "thin", color: { auto: 1 } },
         bottom: { style: "thin", color: { auto: 1 } },
         left: { style: "thin", color: { auto: 1 } }
       }
     };*/
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'Empleado');
    xlsx.utils.book_append_sheet(wb, wst, 'Timbres');
    xlsx.writeFile(wb, "Timbres - " + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' - ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + '.xlsx');
  }



  /*FILTROS DE BÚSQUEDA*/
  sucursales: any = [];
  ListarSucursales() {
    this.sucursales = [];
    this.restSucur.getSucursalesRest().subscribe(res => {
      this.sucursales = res;
    });
  }

  departamentos: any = [];
  ListarDepartamentos() {
    this.departamentos = [];
    this.restDepa.ConsultarDepartamentos().subscribe(res => {
      this.departamentos = res;
    });
  }

  cargos: any = [];
  ListarCargos() {
    this.cargos = [];
    this.restCargo.ObtenerTipoCargos().subscribe(res => {
      this.cargos = res;
    });
  }

  regimen: any = [];
  ListarRegimen() {
    this.regimen = [];
    this.restRegimen.ConsultarRegimen().subscribe(res => {
      this.regimen = res;
    });
  }

  LimpiarBusquedas() {
    this.busquedasForm.patchValue(
      {
        laboralForm: '',
        depaForm: '',
        cargosForm: '',
        sucursalForm: ''
      })
    this.VerDatosEmpleado();
    this.ListarSucursales();
    this.ListarDepartamentos();
    this.ListarCargos();
    this.ListarRegimen();
  }

  LimpiarCampos1() {
    this.busquedasForm.patchValue(
      {
        laboralForm: '',
        depaForm: '',
        cargosForm: ''
      })
  }

  LimpiarCampos2() {
    this.busquedasForm.patchValue(
      {
        depaForm: '',
        cargosForm: ''
      })
  }

  LimpiarCampos3() {
    this.busquedasForm.patchValue(
      { cargosForm: '' })
  }


  FiltrarSucursal(form) {
    this.departamentos = [];
    this.restDepa.BuscarDepartamentoSucursal(form.sucursalForm).subscribe(res => {
      this.departamentos = res;
    });
    this.cargos = [];
    this.restCargo.ObtenerCargoSucursal(form.sucursalForm).subscribe(res => {
      this.cargos = res;
    }, error => {
      this.toastr.info('La sucursal seleccionada no cuenta con cargos registrados.', 'Verificar la Información', {
        timeOut: 3000,
      })
    });
    this.regimen = [];
    this.restRegimen.ConsultarRegimenSucursal(form.sucursalForm).subscribe(res => {
      this.regimen = res;
    });
    this.LimpiarCampos1();
  }

  FiltrarRegimen(form) {
    this.cargos = [];
    this.restCargo.ObtenerCargoRegimen(form.laboralForm).subscribe(res => {
      this.cargos = res;
    }, error => {
      this.toastr.info('El regimen seleccionado no cuenta con cargos registrados.', 'Verificar la Información', {
        timeOut: 3000,
      })
    });
    this.departamentos = [];
    this.restDepa.BuscarDepartamentoRegimen(form.laboralForm).subscribe(res => {
      this.departamentos = res;
    });
    this.LimpiarCampos2();
  }

  FiltrarDepartamento(form) {
    this.cargos = [];
    this.restCargo.ObtenerCargoDepartamento(form.depaForm).subscribe(res => {
      this.cargos = res;
    }, error => {
      this.toastr.info('El departamento seleccionado no cuenta con cargos registrados.', 'Verificar la Información', {
        timeOut: 3000,
      })
    });
    this.LimpiarCampos3();
  }

  VerInformacionSucursal(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucursal(form.sucursalForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuDepa(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuDepa(form.sucursalForm, form.depaForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuDepaRegimen(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuDepaRegimen(form.sucursalForm, form.depaForm, form.laboralForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuCargo(form.sucursalForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuRegimen(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuRegimen(form.sucursalForm, form.laboralForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuRegimenCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuRegimenCargo(form.sucursalForm, form.laboralForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuDepaCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuDepaCargo(form.sucursalForm, form.depaForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionSucuDepaCargoRegimen(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosSucuRegimenDepartamentoCargo(form.sucursalForm, form.depaForm, form.laboralForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionDepartamento(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosDepartamento(form.depaForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionDepaCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosDepaCargo(form.depaForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionDepaRegimen(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosDepaRegimen(form.depaForm, form.laboralForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionDepaRegimenCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosDepaRegimenCargo(form.depaForm, form.laboralForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionRegimen(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosRegimen(form.laboralForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionRegimenCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosRegimenCargo(form.laboralForm, form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerInformacionCargo(form) {
    this.datosEmpleado = [];
    this.restD.VerDatosCargo(form.cargosForm).subscribe(res => {
      this.datosEmpleado = res;
    }, error => {
      this.toastr.error('Ningún dato coincide con los criterios de búsqueda indicados.', 'Verficar Información', {
        timeOut: 6000,
      })
    });
  }

  VerificarBusquedas(form) {
    console.log('form', form.depaForm, form.sucursalForm, form.cargosForm, form.laboralForm)
    if (form.sucursalForm === '' && form.depaForm === '' &&
      form.laboralForm === '' && form.cargosForm === '') {
      this.toastr.info('Ingresar un criterio de búsqueda.', 'Verficar Información', {
        timeOut: 6000,
      })
    }
    else if (form.sucursalForm != '' && form.depaForm === '' &&
      form.laboralForm === '' && form.cargosForm === '') {
      this.VerInformacionSucursal(form);
    }
    else if (form.sucursalForm != '' && form.depaForm != '' &&
      form.laboralForm === '' && form.cargosForm === '') {
      this.VerInformacionSucuDepa(form);
    }
    else if (form.sucursalForm != '' && form.depaForm != '' &&
      form.laboralForm != '' && form.cargosForm === '') {
      this.VerInformacionSucuDepaRegimen(form);
    }
    else if (form.sucursalForm != '' && form.depaForm != '' &&
      form.laboralForm === '' && form.cargosForm != '') {
      this.VerInformacionSucuDepaCargo(form);
    }
    else if (form.sucursalForm != '' && form.depaForm === '' &&
      form.laboralForm === '' && form.cargosForm != '') {
      this.VerInformacionSucuCargo(form);
    }
    else if (form.sucursalForm != '' && form.depaForm === '' &&
      form.laboralForm != '' && form.cargosForm === '') {
      this.VerInformacionSucuRegimen(form);
    }
    else if (form.sucursalForm != '' && form.depaForm === '' &&
      form.laboralForm != '' && form.cargosForm != '') {
      this.VerInformacionSucuRegimenCargo(form);
    }
    else if (form.sucursalForm != '' && form.depaForm != '' &&
      form.laboralForm != '' && form.cargosForm != '') {
      this.VerInformacionSucuDepaCargoRegimen(form);
    }
    else if (form.sucursalForm === '' && form.depaForm != '' &&
      form.laboralForm === '' && form.cargosForm === '') {
      this.VerInformacionDepartamento(form);
    }
    else if (form.sucursalForm === '' && form.depaForm != '' &&
      form.laboralForm === '' && form.cargosForm != '') {
      this.VerInformacionDepaCargo(form);
    }
    else if (form.sucursalForm === '' && form.depaForm != '' &&
      form.laboralForm != '' && form.cargosForm === '') {
      this.VerInformacionDepaRegimen(form);
    }
    else if (form.sucursalForm === '' && form.depaForm != '' &&
      form.laboralForm != '' && form.cargosForm != '') {
      this.VerInformacionDepaRegimenCargo(form);
    }
    else if (form.sucursalForm === '' && form.depaForm === '' &&
      form.laboralForm != '' && form.cargosForm === '') {
      this.VerInformacionRegimen(form);
    }
    else if (form.sucursalForm === '' && form.depaForm === '' &&
      form.laboralForm != '' && form.cargosForm != '') {
      this.VerInformacionRegimenCargo(form);
    }
    else if (form.sucursalForm === '' && form.depaForm === '' &&
      form.laboralForm === '' && form.cargosForm != '') {
      this.VerInformacionCargo(form);
    }
  }

}
