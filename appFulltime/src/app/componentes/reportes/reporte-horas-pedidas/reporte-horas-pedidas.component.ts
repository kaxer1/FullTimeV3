import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
// Librería para generar reportes en formato PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// Librería para generar reportes en formato EXCEL
import * as xlsx from 'xlsx';
import * as moment from 'moment';

// Importación de servicios
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorasExtrasRealesService } from 'src/app/servicios/reportes/horasExtrasReales/horas-extras-reales.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { Router } from '@angular/router';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

@Component({
  selector: 'app-reporte-horas-pedidas',
  templateUrl: './reporte-horas-pedidas.component.html',
  styleUrls: ['./reporte-horas-pedidas.component.css']
})

export class ReporteHorasPedidasComponent implements OnInit {

  // Arreglo datos contrato actual
  datosContratoA: any = [];

  // Arreglo datos cargo actual
  datosCargoA: any = [];

  // Arreglo datos del empleado
  datosEmpleado: any = [];

  // Datos del Fórmulario de búsqueda
  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  apellido = new FormControl('', [Validators.minLength(2)]);
  departamentoF = new FormControl('', [Validators.minLength(2)]);
  regimenF = new FormControl('', [Validators.minLength(2)]);
  cargoF = new FormControl('', [Validators.minLength(2)]);

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

  reporte: boolean = false;

  constructor(
    public rest: EmpleadoService,
    public restH: HorasExtrasRealesService,
    public restEmpre: EmpresaService,
    public restPedido: PedHoraExtraService,
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
    this.VerPedidosHorasAutorizadas();
    this.VerPedidosHorasExtras();
  }

  // Método para ver la información del empleado 
  ObtenerEmpleadoLogueado(idemploy: any) {
    this.empleadoLogueado = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoLogueado = data;
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
  nombreEmpresa: any;
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
      this.nombreEmpresa = res[0].nombre;
    });
  }

  // Método para manejar evento de paginación
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Obtener datos del empleado
  cont: number = 0;
  contador: number = 0;
  iteracion: number = 0;
  conteo: number = 0;
  listaTotal: any = [];
  VerDatosEmpleado() {
    this.datosContratoA = [];
    this.datosCargoA = [];
    this.listaTotal = [];
    this.datosEmpleado = [];
    this.restH.ObtenerDatosContratoA().subscribe(data => {
      this.datosContratoA = data;
      for (var i = 0; i <= this.datosContratoA.length - 1; i++) {
        this.restH.ObtenerDatosCargoA(this.datosContratoA[i].id).subscribe(datos => {
          this.datosCargoA = datos;
          this.iteracion++;
          if (this.datosCargoA.length != 0) {
            if (this.contador === 0) {
              this.listaTotal = datos
              this.contador++;
            }
            else {
              this.listaTotal = this.listaTotal.concat(datos);
            }
          }
          if (this.iteracion === this.datosContratoA.length) {
            this.datosContratoA.forEach(obj => {
              this.listaTotal.forEach(element => {
                if (obj.id === element.emple_id) {
                  let cargarDatos = [{
                    id: obj.id,
                    apellido: obj.apellido,
                    cedula: obj.cedula,
                    codigo: obj.codigo,
                    correo: obj.correo,
                    domicilio: obj.domicilio,
                    esta_civil: obj.esta_civil,
                    estado: obj.estado,
                    fec_nacimiento: obj.fec_nacimiento,
                    genero: obj.genero,
                    id_contrato: obj.id_contrato,
                    id_nacionalidad: obj.id_nacionalidad,
                    imagen: obj.imagen,
                    mail_alternativo: obj.mail_alternativo,
                    nombre: obj.nombre,
                    regimen: obj.regimen,
                    telefono: obj.telefono,
                    cargo: element.cargo,
                    departamento: element.departamento,
                    id_cargo: element.id_cargo,
                    id_departamento: element.id_departamento,
                    id_sucursal: element.id_sucursal,
                    sucursal: element.sucursal,
                    id_empresa: element.id_empresa,
                    empresa: element.empresa,
                    id_ciudad: element.id_ciudad,
                    ciudad: element.ciudad
                  }];
                  if (this.cont === 0) {
                    this.datosEmpleado = cargarDatos
                    this.cont++;
                  }
                  else {
                    this.datosEmpleado = this.datosEmpleado.concat(cargarDatos);
                  }
                }

              });
            });
            console.log("Datos Totales" + '', this.datosEmpleado);
          }
        }, error => {
          this.iteracion++;
        })
      }
    });
  }

  // Método para limpiar registros de campos de búsqueda
  LimpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
    this.departamentoF.reset();
    this.regimenF.reset();
    this.cargoF.reset();
  }

  // Método para ingresar solo letras
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

  // Método para ingresar solo números
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

  // Método para obtener solicitudes de horas extras
  solicitudHoras: any = [];
  VerPedidosHorasExtras() {
    console.log('entra 1')
    this.solicitudHoras = [];
    this.restPedido.ListarPedidosHE().subscribe(data => {
      this.solicitudHoras = data;
      console.log('horas autorizadas', this.solicitudHoras)
    });
  }

  // Método para obtener solicitudes de horas extras autorizadas
  horasAutorizadas: any = [];
  VerPedidosHorasAutorizadas() {
    console.log('entra 2')
    this.horasAutorizadas = [];
    this.restPedido.ListarPedidosHEAutorizadas().subscribe(data => {
      this.horasAutorizadas = data;
      console.log('horas autorizadas', this.horasAutorizadas)
    });
  }

  // Manejo del estado del selector 
  estado_reporte: boolean;
  setAll(completed: boolean) {
    this.estado_reporte = completed;
  }

  solicitudes_empleado: any = [];
  VerPDFSolicitudesEmpleado(action, id_seleccionado) {
    this.solicitudes_empleado = [];
    if (this.estado_reporte === true) {
      this.restPedido.ListarPedidosHEAutorizadas_Empleado(id_seleccionado).subscribe(data => {
        this.solicitudes_empleado = data;
        this.GenerarPdfEmpleado(action, 'autorizadas', id_seleccionado);
        this.reporte = false;
      }, error => {
        this.toastr.info('No se encuentran registros de solicitudes de horas extras')
      });
    }
    else {
      this.restPedido.ListarPedidosHE_Empleado(id_seleccionado).subscribe(data => {
        this.solicitudes_empleado = data;
        this.GenerarPdfEmpleado(action, 'solicitudes', id_seleccionado);
      }, error => {
        this.toastr.info('No se encuentran registros de solicitudes de horas extras')
      });
    }
  }

  VerExcelSolicitudesEmpleado(id_seleccionado) {
    this.solicitudes_empleado = [];
    if (this.estado_reporte === true) {
      this.restPedido.ListarPedidosHEAutorizadas_Empleado(id_seleccionado).subscribe(data => {
        this.solicitudes_empleado = data;
        this.GenerarExcelEmpleado('autorizadas', id_seleccionado);
        this.reporte = false;
      }, error => {
        this.toastr.info('No se encuentran registros de solicitudes de horas extras')
      });
    }
    else {
      this.restPedido.ListarPedidosHE_Empleado(id_seleccionado).subscribe(data => {
        this.solicitudes_empleado = data;
        this.GenerarExcelEmpleado('solicitudes', id_seleccionado);
      }, error => {
        this.toastr.info('No se encuentran registros de solicitudes de horas extras')
      });
    }
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF SOLICITUDES
   * ****************************************************************************************************/

  generarPdf(action = 'open', forma: string) {
    var documentDefinition: any;
    if (forma === 'solicitudes') {
      documentDefinition = this.GenerarArchivoSolicitudes();
    }
    if (forma === 'autorizadas') {
      documentDefinition = this.GenerarSolicitudesAprobadas();
    }
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  GenerarArchivoSolicitudes() {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);
    return {
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        // Obtener fecha y hora actual
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
        return [
          {
            margin: [10, -2, 10, 0],
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
        ]
      },

      // Títulos del archivo PDF y contenido general 
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: this.nombreEmpresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
        { text: 'REPORTE GENERAL DE SOLICITUDES DE HORAS EXTRAS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
        this.presentarSolicitudes(),
      ],

      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        tableHeaderA: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, margin: [0, 10, 0, 10] },
      }
    };
  }

  // Estructura Lista de Solicitudes
  contarRegistros: number = 0;
  presentarSolicitudes() {
    this.contarRegistros = 0;
    return {
      table: {
        widths: ['auto', 'auto', '*', '*', 'auto', 'auto', '*', 'auto'],
        body: [
          [
            { rowSpan: 2, text: 'N° REGISTRO', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'CÓDIGO', style: 'tableHeaderA' },
            { colSpan: 2, text: 'EMPLEADO', style: 'tableHeader', fillColor: this.s_color },
            '',
            { rowSpan: 2, text: 'FECHA INICIO', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'FECHA FIN', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'DESCRIPCIÓN', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'HORAS SOLICITADAS', style: 'tableHeaderA' },
          ],
          [
            '', '',
            { text: 'NOMBRE', style: 'tableHeader' },
            { text: 'APELLIDO', style: 'tableHeader' },
            '', '', '', ''
          ],
          ...this.solicitudHoras.map(obj => {
            this.contarRegistros = this.contarRegistros + 1;
            return [
              { text: this.contarRegistros, style: 'itemsTableD' },
              { text: obj.codigo, style: 'itemsTableD' },
              { text: obj.nombre, style: 'itemsTableD' },
              { text: obj.apellido, style: 'itemsTableD' },
              { text: moment(obj.fec_inicio).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: moment(obj.fec_final).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: obj.descripcion, style: 'itemsTableD' },
              { text: obj.num_hora, style: 'itemsTableD' },
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

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL SOLICITUDES
   * ****************************************************************************************************/

  GenerarExcel(forma: string) {
    if (forma === 'solicitudes') {
      this.ExportarExcelSolicitudes();
    }
    if (forma === 'autorizadas') {
      this.ExportarExcelSolicitudesAutorizadas();
    }
  }

  ExportarExcelSolicitudes() {
    this.contarRegistros = 0;
    const wsa: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.solicitudHoras.map(obj => {
      this.contarRegistros = this.contarRegistros + 1;
      return {
        N_REGISTROS: this.contarRegistros,
        CODIGO: obj.codigo,
        EMPLEADO: obj.nombre + ' ' + obj.apellido,
        FECHA_INICIO: moment(obj.fec_inicio).format('DD/MM/YYYY'),
        FECHA_FIN: moment(obj.fec_final).format('DD/MM/YYYY'),
        DESCRIPCION: obj.descripcion,
        HORAS_SOLICITADAS: obj.num_hora,
      }
    }));
    const header = Object.keys(this.solicitudHoras[0]); // nombres de las columnas
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // contar columnas
      wscols.push({ wpx: 80 })
    }
    wsa["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsa, 'Solicitud Horas Extras');
    var f = moment();
    xlsx.writeFile(wb, "SolicitudesHorasExtras - " + f.format('YYYY-MM-DD') + '.xlsx');
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF SOLICITUDES AUTORIZADAS
   * ****************************************************************************************************/

  GenerarSolicitudesAprobadas() {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);
    return {
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        // Obtener fecha y hora actual
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
        return [
          {
            margin: [10, -2, 10, 0],
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
        ]
      },

      // Títulos del archivo PDF y contenido general 
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: this.nombreEmpresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
        { text: 'REPORTE GENERAL DE SOLICITUDES DE HORAS EXTRAS AUTORIZADAS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
        this.presentarSolicitudesAutorizadas(),
      ],

      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        tableHeaderA: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, margin: [0, 10, 0, 10] },
      }
    };
  }

  // Estructura Lista de Solicitudes Autorizadas
  presentarSolicitudesAutorizadas() {
    this.contarRegistros = 0;
    return {
      table: {
        widths: ['auto', 'auto', '*', '*', 'auto', 'auto', '*', 'auto', 'auto'],
        body: [
          [
            { rowSpan: 2, text: 'N° REGISTRO', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'CÓDIGO', style: 'tableHeaderA' },
            { colSpan: 2, text: 'EMPLEADO', style: 'tableHeader', fillColor: this.s_color },
            '',
            { rowSpan: 2, text: 'FECHA INICIO', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'FECHA FIN', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'DESCRIPCIÓN', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'HORAS AUTORIZADAS', style: 'tableHeaderA' },
            { rowSpan: 2, text: 'ESTADO', style: 'tableHeaderA' },
          ],
          [
            '', '',
            { text: 'NOMBRE', style: 'tableHeader' },
            { text: 'APELLIDO', style: 'tableHeader' },
            '', '', '', '', ''
          ],
          ...this.horasAutorizadas.map(obj => {
            if (obj.estado === 3) {
              obj.estado = 'Autorizado'
            }
            this.contarRegistros = this.contarRegistros + 1;
            return [
              { text: this.contarRegistros, style: 'itemsTableD' },
              { text: obj.codigo, style: 'itemsTableD' },
              { text: obj.nombre, style: 'itemsTableD' },
              { text: obj.apellido, style: 'itemsTableD' },
              { text: moment(obj.fec_inicio).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: moment(obj.fec_final).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: obj.descripcion, style: 'itemsTableD' },
              { text: obj.tiempo_autorizado, style: 'itemsTableD' },
              { text: obj.estado, style: 'itemsTableD' },
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

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL SOLICITUDES AUTORIZADAS
   * ****************************************************************************************************/

  ExportarExcelSolicitudesAutorizadas() {
    this.contarRegistros = 0;
    const wsa: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.horasAutorizadas.map(obj => {
      if (obj.estado === 3) {
        obj.estado = 'Autorizado'
      }
      this.contarRegistros = this.contarRegistros + 1;
      return {
        N_REGISTROS: this.contarRegistros,
        CODIGO: obj.codigo,
        EMPLEADO: obj.nombre + ' ' + obj.apellido,
        FECHA_INICIO: moment(obj.fec_inicio).format('DD/MM/YYYY'),
        FECHA_FIN: moment(obj.fec_final).format('DD/MM/YYYY'),
        DESCRIPCION: obj.descripcion,
        HORAS_SOLICITADAS: obj.tiempo_autorizado,
        ESTADO: obj.estado
      }
    }));
    const header = Object.keys(this.horasAutorizadas[0]); // nombres de las columnas
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // contar columnas
      wscols.push({ wpx: 80 })
    }
    wsa["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsa, 'HorasExtras Autorizadas');
    var f = moment();
    xlsx.writeFile(wb, "SolicitudesAutorizadas - " + f.format('YYYY-MM-DD') + '.xlsx');
  }

  /** *******************************************************************************************
   *                             EXPORTAR ARCHIVOS EN FORMATO PDF SOLICITUDES POR EMPLEADO       
   *  **********************************************************************************************/

  GenerarPdfEmpleado(action = 'open', forma: string, id_seleccionado: number) {
    var documentDefinition: any;
    if (forma === 'solicitudes') {
      documentDefinition = this.GenerarSolicitudEmpleado(id_seleccionado);
    }
    if (forma === 'autorizadas') {
      documentDefinition = this.GenerarSolicitudAutorizaEmpleado(id_seleccionado);
    }
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  GenerarSolicitudEmpleado(id_seleccionado: number) {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);
    return {
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        // Obtener fecha y hora actual
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
        return [
          {
            margin: [10, -2, 10, 0],
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
            ], fontSize: 9
          }
        ]
      },
      // Títulos del archivo PDF y contenido general 
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        ...this.datosEmpleado.map(obj => {
          if (obj.id === id_seleccionado) {
            return [
              { text: obj.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
              { text: 'REPORTE DE SOLICITUDES DE HORAS EXTRAS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
            ];
          }
        }),
        this.DatosSolicitudEmpleado(id_seleccionado),
        this.PresentarSolicitudEmpleado(),
      ],

      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
      }
    };
  }

  // Datos generales del PDF 
  DatosSolicitudEmpleado(id_seleccionado) {
    // Inicialización de varibles
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo, regimen;
    // Búsqueda de los datos del empleado del cual se obtiene el reporte
    this.datosEmpleado.forEach(obj => {
      if (obj.id === id_seleccionado) {
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
              { text: [{ text: 'CIUDAD: ' + ciudad, style: 'itemsTableI' }] },
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
              { text: [{ text: 'N° REGISTROS: ' + this.solicitudes_empleado.length, style: 'itemsTableI' }] },
            ]
          }],
          [{ text: 'LISTA DE SOLICITUDES DE HORAS EXTRAS', style: 'tableHeader' },],
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

  // Estructura Lista de Registros
  PresentarSolicitudEmpleado() {
    this.contarRegistros = 0;
    return {
      table: {
        widths: ['auto', 'auto', 'auto', '*', 'auto'],
        body: [
          [
            { text: 'N° REGISTRO', style: 'tableHeader' },
            { text: 'FECHA INICIO', style: 'tableHeader' },
            { text: 'FECHA FINAL', style: 'tableHeader' },
            { text: 'DESCRIPCIÓN', style: 'tableHeader' },
            { text: 'HORAS SOLICITADAS', style: 'tableHeader' },
          ],
          ...this.solicitudes_empleado.map(obj => {
            this.contarRegistros = this.contarRegistros + 1;
            return [
              { text: this.contarRegistros, style: 'itemsTableD' },
              { text: moment(obj.fec_inicio).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: moment(obj.fec_final).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: obj.descripcion, style: 'itemsTableD' },
              { text: obj.num_hora, style: 'itemsTableD' },
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

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL SOLICITUDES 
   * ****************************************************************************************************/

  GenerarExcelEmpleado(forma: string, id_seleccionado) {
    if (forma === 'solicitudes') {
      this.GenerarExcelSolicitudEmpleado(id_seleccionado);
    }
    if (forma === 'autorizadas') {
      this.GenerarExcelSolicitudAutorizadaEmpleado(id_seleccionado);
    }
  }

  GenerarExcelSolicitudEmpleado(id_seleccionado) {
    this.contarRegistros = 0;
    // Inicialización de varibles
    var datosGenerales, mensaje: string;
    // Búsqueda de los datos del empleado del cual se obtiene el reporte
    this.datosEmpleado.forEach(obj => {
      if (obj.id === id_seleccionado) {
        datosGenerales = [{
          NOMBRE: obj.nombre,
          APELLIDO: obj.apellido,
          CEDULA: obj.cedula,
          CODIGO: obj.codigo,
          SUCURSAL: obj.sucursal,
          DEPARTAMENTO: obj.departamento,
          CIUDAD: obj.ciudad,
          CARGO: obj.cargo,
          REGIMEN: obj.regimen
        }]
      }
    });
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datosGenerales);

    const headerE = Object.keys(datosGenerales[0]); // columns name

    var wscolsE = [];
    for (var i = 0; i < headerE.length; i++) {  // columns length added
      wscolsE.push({ wpx: 80 })
    }
    wse["!cols"] = wscolsE;

    const wsa: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.solicitudes_empleado.map(obj => {
      this.contarRegistros = this.contarRegistros + 1;
      return {
        N_REGISTROS: this.contarRegistros,
        FECHA_INICIO: moment(obj.fec_inicio).format('DD/MM/YYYY'),
        FECHA_FIN: moment(obj.fec_final).format('DD/MM/YYYY'),
        DESCRIPCION: obj.descripcion,
        HORAS_SOLICITADAS: obj.num_hora,
      }
    }));
    const header = Object.keys(this.solicitudes_empleado[0]); // nombres de las columnas
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // contar columnas
      wscols.push({ wpx: 80 })
    }
    wsa["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'Empleado');
    xlsx.utils.book_append_sheet(wb, wsa, 'Solicitud Horas Extras');
    var f = moment();
    xlsx.writeFile(wb, "SolicitudesHorasExtras - " + f.format('YYYY-MM-DD') + '.xlsx');
  }

  /** *******************************************************************************************
   *             EXPORTAR ARCHIVOS EN FORMATO PDF SOLICITUDES AUTORIZADAS POR EMPLEADO       
   *  **********************************************************************************************/

  GenerarSolicitudAutorizaEmpleado(id_seleccionado: number) {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);
    return {
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        // Obtener fecha y hora actual
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
        return [
          {
            margin: [10, -2, 10, 0],
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
            ], fontSize: 9
          }
        ]
      },
      // Títulos del archivo PDF y contenido general 
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        ...this.datosEmpleado.map(obj => {
          if (obj.id === id_seleccionado) {
            return [
              { text: obj.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
              { text: 'REPORTE DE SOLICITUDES DE HORAS EXTRAS AUTORIZADAS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
            ];
          }
        }),
        this.DatosSolicitudAutorizaEmpleado(id_seleccionado),
        this.PresentarSolicitudAutorizaEmpleado(),
      ],

      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
      }
    };
  }

  // Datos generales del PDF 
  DatosSolicitudAutorizaEmpleado(id_seleccionado) {
    // Inicialización de varibles
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo, regimen;
    // Búsqueda de los datos del empleado del cual se obtiene el reporte
    this.datosEmpleado.forEach(obj => {
      if (obj.id === id_seleccionado) {
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
              { text: [{ text: 'CIUDAD: ' + ciudad, style: 'itemsTableI' }] },
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
              { text: [{ text: 'N° REGISTROS: ' + this.solicitudes_empleado.length, style: 'itemsTableI' }] },
            ]
          }],
          [{ text: 'LISTA DE SOLICITUDES DE HORAS EXTRAS AUTORIZADAS', style: 'tableHeader' },],
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

  // Estructura Lista de Registros
  PresentarSolicitudAutorizaEmpleado() {
    this.contarRegistros = 0;
    return {
      table: {
        widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto'],
        body: [
          [
            { text: 'N° REGISTRO', style: 'tableHeader' },
            { text: 'FECHA INICIO', style: 'tableHeader' },
            { text: 'FECHA FINAL', style: 'tableHeader' },
            { text: 'DESCRIPCIÓN', style: 'tableHeader' },
            { text: 'ESTADO', style: 'tableHeader' },
            { text: 'HORAS AUTORIZADAS', style: 'tableHeader' },
          ],
          ...this.solicitudes_empleado.map(obj => {
            if (obj.estado === 3) {
              obj.estado = 'Autorizado'
            }
            this.contarRegistros = this.contarRegistros + 1;
            return [
              { text: this.contarRegistros, style: 'itemsTableD' },
              { text: moment(obj.fec_inicio).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: moment(obj.fec_final).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: obj.descripcion, style: 'itemsTableD' },
              { text: obj.estado, style: 'itemsTableD' },
              { text: obj.tiempo_autorizado, style: 'itemsTableD' },
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

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL SOLICITUDES AUTORIZADAS
   * ****************************************************************************************************/

  GenerarExcelSolicitudAutorizadaEmpleado(id_seleccionado) {
    this.contarRegistros = 0;
    // Inicialización de varibles
    var datosGenerales: any;
    // Búsqueda de los datos del empleado del cual se obtiene el reporte
    this.datosEmpleado.forEach(obj => {
      if (obj.id === id_seleccionado) {
        datosGenerales = [{
          NOMBRE: obj.nombre,
          APELLIDO: obj.apellido,
          CEDULA: obj.cedula,
          CODIGO: obj.codigo,
          SUCURSAL: obj.sucursal,
          DEPARTAMENTO: obj.departamento,
          CIUDAD: obj.ciudad,
          CARGO: obj.cargo,
          REGIMEN: obj.regimen
        }]
      }
    });
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datosGenerales);

    const headerE = Object.keys(datosGenerales[0]); // columns name

    var wscolsE = [];
    for (var i = 0; i < headerE.length; i++) {  // columns length added
      wscolsE.push({ wpx: 80 })
    }
    wse["!cols"] = wscolsE;

    const wsa: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.solicitudes_empleado.map(obj => {
      if (obj.estado === 3) {
        obj.estado = 'Autorizado'
      }
      this.contarRegistros = this.contarRegistros + 1;
      return {
        N_REGISTROS: this.contarRegistros,
        FECHA_INICIO: moment(obj.fec_inicio).format('DD/MM/YYYY'),
        FECHA_FIN: moment(obj.fec_final).format('DD/MM/YYYY'),
        DESCRIPCION: obj.descripcion,
        ESTADO: obj.estado,
        HORAS_SOLICITADAS: obj.tiempo_autorizado,
      }
    }));
    const header = Object.keys(this.solicitudes_empleado[0]); // nombres de las columnas
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // contar columnas
      wscols.push({ wpx: 80 })
    }
    wsa["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'Empleado');
    xlsx.utils.book_append_sheet(wb, wsa, 'SolicitudHoras Autorizadas');
    var f = moment();
    xlsx.writeFile(wb, "SolicitudAutorizadas - " + f.format('YYYY-MM-DD') + '.xlsx');
  }

}
