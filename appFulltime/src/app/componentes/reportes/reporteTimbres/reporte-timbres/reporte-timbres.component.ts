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
    public router: Router,
    private toastr: ToastrService,
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
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
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
      this.toastr.info('Ingresar fechas de periodo de búsqueda.', 'VERIFICAR DATOS DE FECHA')
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
          console.log('datos timbres', this.timbres);
          if (archivo === 'pdf') {
            this.generarPdf('open', id_seleccionado, form);
            this.LimpiarFechas();
          }
          else if (archivo === 'excel') {
            this.exportToExcelTimbres(id_seleccionado, form);
            this.LimpiarFechas();
          }
        }, error => {
          this.toastr.info('No existen timbres registrado en el periodo indicado.', 'VERIFICAR')
        }
        );
      }
      else {
        this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR');
      }
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
        ...this.datosEmpleado.map(obj => {
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
        widths: ['*', '*', '*', '*', '*', '*', '*'],
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

}
