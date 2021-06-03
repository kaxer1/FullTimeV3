import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';

import { NotificacionService } from 'src/app/servicios/reportes/notificaciones/notificacion.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-administrador-todas',
  templateUrl: './administrador-todas.component.html',
  styleUrls: ['./administrador-todas.component.css']
})
export class AdministradorTodasComponent implements OnInit {

  // ITEMS DE PAGINACIÓN DE LA TABLA DE LISTA DE SOLICITUDES PENDIENTES
  pageSizeOptions = [5, 10, 20, 50];
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;

  idEmpleadoLogueado: any;

  constructor(
    public restN: NotificacionService,
    public restEmpre: EmpresaService,
    public restE: EmpleadoService,
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ListarTipos();
    this.ObtenerLogo();
    this.ObtenerColores();
    this.ListarPermisosEnviados();
    this.ListarPermisosRecibidos();
    this.ListarHorasEnviados();
    this.ListarHorasRecibidos();
    this.ListarVacacionesEnviados();
    this.ListarVacacionesRecibidos();
    this.ListarPlanificacionesEnviados();
    this.ListarPlanificacionesEliminadas();
    this.ObtenerEmpleados(this.idEmpleadoLogueado);
  }

  // MÉTODO PARA MOSTRAR UN DETERMINADO NÚMERO DE FILAS EN LA TABLA DE SOLICITUDES PENDIENTES
  ManejarPagina(e: PageEvent) {
    this.numero_pagina = e.pageIndex + 1;
    this.tamanio_pagina = e.pageSize;
  }

  // LISTA DE TIPOS DE NOTIFICACIONES
  tipos: any = [];
  ListarTipos() {
    this.tipos = [
      { id: 1, nombre: 'Permisos' },
      { id: 2, nombre: 'Vacaciones' },
      { id: 3, nombre: 'Horas Extras' },
      //{ id: 4, nombre: 'Planificación Horas Extras' },
      { id: 4, nombre: 'Planificación Servicio Alimentación' },
      //{ id: 5, nombre: 'Solicitud Servicio Alimentación' },
    ]
  }

  // BÚSQUEDA DE DATOS DE EMPLEADO LOGUEADO
  empleado: any = [];
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  // MÉTODO PARA OBTENER EL LOGO DE LA EMPRESA
  logo: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logo = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  // MÉTODO PARA OBTENER COLORES DE EMPRESA
  p_color: any;
  s_color: any;
  ObtenerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  /** ************************************************************************************** */
  /**                 LISTA DE DATOS DE NOTIFICACIONES DE PERMISOS                           */
  /** ************************************************************************************** */
  // LISTA DE PERMISOS ENVIADOS
  permisos_enviados: any = [];
  ListarPermisosEnviados() {
    this.permisos_enviados = [];
    this.restN.ObtenerPermisosEnviados(this.idEmpleadoLogueado).subscribe(res => {
      this.permisos_enviados = res;
      console.log('solo_enviados', this.permisos_enviados)
    })
  }

  permisos_recibidos: any = [];
  ListarPermisosRecibidos() {
    this.permisos_recibidos = [];
    this.restN.ObtenerPermisosRecibidos(this.idEmpleadoLogueado).subscribe(res => {
      this.permisos_recibidos = res;
      console.log('solo_enviados', this.permisos_recibidos)
    })
  }

  GenerarPDF(action = 'open', tipo: number, forma: string) {

    if (tipo === 1) {
      var documentDefinition = this.DocumentarPermisos(forma);
    }
    else if (tipo === 2) {
      documentDefinition = this.DocumentarVacaciones(forma);
    }
    else if (tipo === 3) {
      documentDefinition = this.DocumentarHorasExtras(forma);
    }
    else if (tipo === 4) {
      documentDefinition = this.DocumentarPlanificaciones(forma);
    }

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  DocumentarPermisos(forma: string) {
    var titulo = '';
    if (forma === 'E') {
      titulo = 'NOTIFICACIONES ENVIADAS REFERENTES A PERMISOS';
    }
    else if (forma === 'R') {
      titulo = 'NOTIFICACIONES RECIBIDAS REFERENTES A PERMISOS';
    }

    sessionStorage.setItem('Permisos', this.permisos_enviados);
    return {
      // ENCABEZADO DE LA PÁGINA
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // PIE DE PÁGINA
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // FORMATO DE HORA ACTUAL
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: titulo, bold: true, fontSize: 20, alignment: 'center', margin: [0, 10, 0, 3] },
        this.PresentarPermisos(forma),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableC: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  PresentarPermisos(forma: string) {
    if (forma === 'E') {
      var datos = this.permisos_enviados;
    }
    else if (forma === 'R') {
      datos = this.permisos_recibidos;
    }
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Fecha Envío', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Apellido', style: 'tableHeader' },
                { text: 'Cédula', style: 'tableHeader' },
                { text: 'Permiso', style: 'tableHeader' },
                { text: 'Fecha Inicio', style: 'tableHeader' },
                { text: 'Fecha Final', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' }
              ],
              ...datos.map(obj => {
                return [
                  { text: obj.create_at.split('T')[0], style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.apellido, style: 'itemsTable' },
                  { text: obj.cedula, style: 'itemsTable' },
                  { text: obj.permiso, style: 'itemsTableC' },
                  { text: obj.fec_inicio.split('T')[0], style: 'itemsTableC' },
                  { text: obj.fec_final.split('T')[0], style: 'itemsTableC' },
                  { text: obj.estado, style: 'itemsTableC' }
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
    };
  }

  /** ************************************************************************************** */
  /**                 LISTA DE DATOS DE NOTIFICACIONES DE HORAS EXTRAS                           */
  /** ************************************************************************************** */
  // LISTA DE PERMISOS ENVIADOS
  solicita_horas_enviados: any = [];
  ListarHorasEnviados() {
    this.solicita_horas_enviados = [];
    this.restN.ObtenerHorasExtrasEnviados(this.idEmpleadoLogueado).subscribe(res => {
      this.solicita_horas_enviados = res;
      console.log('solo_enviados', this.solicita_horas_enviados)
    })
  }

  solicita_horas_recibidos: any = [];
  ListarHorasRecibidos() {
    this.solicita_horas_recibidos = [];
    this.restN.ObtenerHorasExtrasRecibidas(this.idEmpleadoLogueado).subscribe(res => {
      this.solicita_horas_recibidos = res;
      console.log('solo_enviados', this.solicita_horas_recibidos)
    })
  }

  DocumentarHorasExtras(forma: string) {
    var titulo = '';
    if (forma === 'E') {
      titulo = 'NOTIFICACIONES ENVIADAS REFERENTES A SOLICITUD HORAS EXTRAS';
    }
    else if (forma === 'R') {
      titulo = 'NOTIFICACIONES RECIBIDAS REFERENTES A SOLICITUD HORAS EXTRAS';
    }
    sessionStorage.setItem('Horas Extras', this.solicita_horas_enviados);
    return {
      // ENCABEZADO DE LA PÁGINA
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // PIE DE PÁGINA
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // FORMATO DE HORA ACTUAL
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: titulo, bold: true, fontSize: 20, alignment: 'center', margin: [0, 10, 0, 3] },
        this.PresentarHorasExtras(forma),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableC: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  PresentarHorasExtras(forma: string) {
    if (forma === 'E') {
      var datos = this.solicita_horas_enviados;
    }
    else if (forma === 'R') {
      datos = this.solicita_horas_recibidos;
    }
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Fecha Envío', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Apellido', style: 'tableHeader' },
                { text: 'Cédula', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Fecha Inicio', style: 'tableHeader' },
                { text: 'Fecha Final', style: 'tableHeader' },
                { text: 'Horas Solicitadas', style: 'tableHeader' },
                { text: 'Horas Autorizadas', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' }
              ],
              ...datos.map(obj => {
                return [
                  { text: obj.create_at.split('T')[0], style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.apellido, style: 'itemsTable' },
                  { text: obj.cedula, style: 'itemsTable' },
                  { text: obj.descripcion, style: 'itemsTableC' },
                  { text: obj.fec_inicio.split('T')[0], style: 'itemsTableC' },
                  { text: obj.fec_final.split('T')[0], style: 'itemsTableC' },
                  { text: obj.num_hora, style: 'itemsTableC' },
                  { text: obj.tiempo_autorizado, style: 'itemsTableC' },
                  { text: obj.estado, style: 'itemsTableC' }
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
    };
  }

  /** ************************************************************************************** */
  /**                 LISTA DE DATOS DE NOTIFICACIONES DE VACACIONES                          */
  /** ************************************************************************************** */
  // LISTA DE PERMISOS ENVIADOS
  vacaciones_enviados: any = [];
  ListarVacacionesEnviados() {
    this.vacaciones_enviados = [];
    this.restN.ObtenerVacacionesEnviadas(this.idEmpleadoLogueado).subscribe(res => {
      this.vacaciones_enviados = res;
      console.log('solo_enviados', this.vacaciones_enviados)
    })
  }

  vacaciones_recibidos: any = [];
  ListarVacacionesRecibidos() {
    this.vacaciones_recibidos = [];
    this.restN.ObtenerVacacionesRecibidas(this.idEmpleadoLogueado).subscribe(res => {
      this.vacaciones_recibidos = res;
      console.log('solo_enviados', this.vacaciones_recibidos)
    })
  }

  DocumentarVacaciones(forma: string) {
    var titulo = '';
    if (forma === 'E') {
      titulo = 'NOTIFICACIONES ENVIADAS REFERENTES A VACACIONES';
    }
    else if (forma === 'R') {
      titulo = 'NOTIFICACIONES RECIBIDAS REFERENTES A VACACIONES';
    }
    sessionStorage.setItem('VACACIONES', this.vacaciones_enviados);
    return {
      // ENCABEZADO DE LA PÁGINA
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // PIE DE PÁGINA
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // FORMATO DE HORA ACTUAL
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: titulo, bold: true, fontSize: 20, alignment: 'center', margin: [0, 10, 0, 3] },
        this.Presentarvacaciones(forma),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableC: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  Presentarvacaciones(forma: string) {
    if (forma === 'E') {
      var datos = this.vacaciones_enviados;
    }
    else if (forma === 'R') {
      datos = this.vacaciones_recibidos;
    }
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Fecha Envío', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Apellido', style: 'tableHeader' },
                { text: 'Cédula', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Fecha Inicio', style: 'tableHeader' },
                { text: 'Fecha Final', style: 'tableHeader' },
                { text: 'Fecha Ingreso', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' }
              ],
              ...datos.map(obj => {
                return [
                  { text: obj.create_at.split('T')[0], style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.apellido, style: 'itemsTable' },
                  { text: obj.cedula, style: 'itemsTable' },
                  { text: 'Vacaciones', style: 'itemsTableC' },
                  { text: obj.fec_inicio.split('T')[0], style: 'itemsTableC' },
                  { text: obj.fec_final.split('T')[0], style: 'itemsTableC' },
                  { text: obj.fec_ingreso.split('T')[0], style: 'itemsTableC' },
                  { text: obj.estado, style: 'itemsTable' },
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
    };
  }

  /** ************************************************************************************** */
  /**                 LISTA DE DATOS DE NOTIFICACIONES DE PLANIFICACIONES                          */
  /** ************************************************************************************** */
  // LISTA DE PERMISOS ENVIADOS
  planificaciones_enviados: any = [];
  ListarPlanificacionesEnviados() {
    this.planificaciones_enviados = [];
    this.restN.ObtenerPalnificacionesEnviadas(this.idEmpleadoLogueado).subscribe(res => {
      this.planificaciones_enviados = res;
      console.log('solo_enviados', this.planificaciones_enviados)
    })
  }

  planificaciones_eliminadas: any = [];
  ListarPlanificacionesEliminadas() {
    this.planificaciones_eliminadas = [];
    this.restN.ObtenerPlanificacionesEliminadas(this.idEmpleadoLogueado).subscribe(res => {
      this.planificaciones_eliminadas = res;
      console.log('solo_enviados', this.planificaciones_eliminadas)
    })
  }

  DocumentarPlanificaciones(forma: string) {
    var titulo = '';
    if (forma === 'E') {
      titulo = 'NOTIFICACIONES ENVIADAS REFERENTES A PLANIFICACIONES';
    }
    else if (forma === 'D') {
      titulo = 'NOTIFICACIONES ELIMINADAS REFERENTES A PLANIFICACIONES';
    }
    sessionStorage.setItem('PLANIFICACIONES', this.planificaciones_enviados);
    return {
      // ENCABEZADO DE LA PÁGINA
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // PIE DE PÁGINA
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        // FORMATO DE HORA ACTUAL
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: titulo, bold: true, fontSize: 20, alignment: 'center', margin: [0, 10, 0, 3] },
        this.PresentarPlanificaciones(forma),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableC: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  PresentarPlanificaciones(forma: string) {
    if (forma === 'E') {
      var datos = this.planificaciones_enviados;
    }
    else if (forma === 'D') {
      datos = this.planificaciones_eliminadas;
    }
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Fecha Envío', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Apellido', style: 'tableHeader' },
                { text: 'Cédula', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
              ],
              ...datos.map(obj => {
                return [
                  { text: obj.create_at.split('T')[0], style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.apellido, style: 'itemsTable' },
                  { text: obj.cedula, style: 'itemsTable' },
                  { text: obj.descripcion, style: 'itemsTable' },
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
    };
  }
}
