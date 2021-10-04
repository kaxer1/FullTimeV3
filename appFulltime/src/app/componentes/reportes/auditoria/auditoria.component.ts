// IMPORTAR LIBRERIAS
import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { ToastrService } from 'ngx-toastr';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import * as xlsx from 'xlsx';

// IMPORTAR SERVICIOS
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { AuditoriaService } from 'src/app/servicios/auditoria/auditoria.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {

  // CRITERIOS DE BÚSQUEDA POR FECHAS
  get rangoFechas() { return this.reporteService.rangoFechas };

  // ITEMS DE PAGINACION DE LA TABLA
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // VARIABLES DE ALMACENAMIENTO DE DATOS
  empleados: any = [];
  empleadoD: any = [];
  idEmpleado: number;

  constructor(
    private reporteService: ReportesService,
    private restEmpleado: EmpleadoService,
    private restAuditar: AuditoriaService,
    private restEmpre: EmpresaService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.ObtenerEmpleados();
    this.ObtenerEmpleadoLogueado(this.idEmpleado);
    this.ListarTipos();
  }

  // LISTA DE REPORTES DE AUDITORIA
  tipos: any = [];
  ListarTipos() {
    this.tipos = [
      { id: 1, nombre: 'Atrasos', value: 'atrasos' },
      { id: 2, nombre: 'Horarios', value: 'empl_horarios' },
      { id: 3, nombre: 'Ingreso al Sistema', value: 'logged_user' },
      { id: 4, nombre: 'Timbres', value: 'timbres' },
      { id: 5, nombre: 'Permisos', value: 'permisos' },
      { id: 6, nombre: 'Planificación de horas extras', value: 'plan_hora_extra' },
      { id: 7, nombre: 'Planificación de servicios de alimentación', value: 'plan_hora_extra_empleado' },
      { id: 8, nombre: 'Solicitud de servicios de alimentación', value: 'solicita_comidas' },
      { id: 9, nombre: 'Vacaciones', value: 'vacaciones' },
      { id: 10, nombre: 'Roles', value: 'cg_roles' },
      { id: 11, nombre: 'Feriados', value: 'cg_feriados' },
      { id: 12, nombre: 'Empleados', value: 'empleados' },
      { id: 13, nombre: 'Autoriza Departamento', value: 'depa_autorizaciones' },
      { id: 14, nombre: 'Autorizaciones', value: 'autorizaciones' },
      { id: 15, nombre: 'Procesos Empleado', value: 'empl_procesos' },
      { id: 16, nombre: 'Funciones', value: 'funciones' },
      { id: 17, nombre: 'Acciones de Personal', value: 'accion_personal_empleado' },
      { id: 18, nombre: 'Servicio Alimentación Invitados', value: 'comida_invitados' },
    ]
  }

  auditoria: any = [];
  PresentarReporte(opcion: number, valor: any) {
    this.auditoria = [];
    if (this.rangoFechas.fec_inico === '' || this.rangoFechas.fec_final === '') return this.toastr.info('Validar fechas de búsqueda.');
    let data = {
      tabla: valor,
      desde: this.rangoFechas.fec_inico,
      hasta: this.rangoFechas.fec_final
    }
    this.restAuditar.ConsultarAuditoria(data).subscribe(res => {
      this.auditoria = res;
      if (opcion === 1) {
        this.GenerarPdf('download', this.auditoria);
      }
      else {
        this.GenerarExcel(this.auditoria);
      }
    }, error => {
      this.toastr.info('En el período indicado no se encuentran registros.', '', {
        timeOut: 10000,
      }).onTap.subscribe(obj => {
      });
    });
  }

  ObtenerEmpleados() {
    this.empleados = [];
    this.restEmpleado.getEmpleadosRest().subscribe(res => {
      this.empleados = res;
    });
  }

  // MÉTODO PARA VER LA INFORMACION DE EMPLEADO QUE INICIA SESIÓN 
  urlImagen: string;
  nombreEmpresa: string;
  ObtenerEmpleadoLogueado(idemploy: any) {
    this.empleadoD = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoD = data;
    });
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.urlImagen = 'data:image/jpeg;base64,' + res.imagen;
      this.nombreEmpresa = res.nom_empresa;
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

  lista: any = [];

  // MÉTODO PARA MANEJAR PAGINACIÓN DE LA TABLA DE DATOS
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  /* ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF 
  * ****************************************************************************************************/
  fechaHoy: string;

  GenerarPdf(action = 'open', datos: any) {

    let documentDefinition = this.EstructurarPDF(datos);

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }


  EstructurarPDF(datos: any) {
    return {
      pageOrientation: 'landscape',
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoD[0].nombre + ' ' + this.empleadoD[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage: any, pageCount: any, fecha: any, hora: any) {
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        hora = f.format('HH:mm:ss');
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha + ' Hora: ' + hora,
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
        { image: this.urlImagen, width: 100, margin: [10, -25, 0, 5] },
        { text: localStorage.getItem('name_empresa').toLocaleUpperCase(), bold: true, fontSize: 18, alignment: 'center', margin: [0, -30, 0, 10] },
        { text: 'Reporte Auditoría', bold: true, fontSize: 16, alignment: 'center', margin: [0, -10, 0, 5] },
        this.PresentarDatos(datos),
      ],
      styles: {
        tableHeaderDetalle: { bold: true, alignment: 'center', fillColor: this.p_color, fontSize: 9, margin: [0, 3, 0, 3] },
        itemsTableDetalle: { fontSize: 7, margin: [0, 3, 0, 3] },
      }
    };
  }

  PresentarDatos(datosRest: any[]) {
    let accion = '';
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              this.FuncionTituloColumna(),
              ...datosRest.map((obj) => {
                if (obj.action === 'I') {
                  accion = 'Insertar';
                }
                if (obj.action === 'U') {
                  accion = 'Actualizar';
                }
                if (obj.action === 'D') {
                  accion = 'Eliminar';
                }
                var array = [
                  { style: 'itemsTableDetalle', text: obj.action_tstamp.split('T')[0] },
                  { style: 'itemsTableDetalle', text: obj.action_tstamp.split('T')[0].split('.')[0] },
                  { style: 'itemsTableDetalle', text: obj.user_name },
                  { style: 'itemsTableDetalle', text: accion },
                  { style: 'itemsTableDetalle', text: obj.table_name },
                  { style: 'itemsTableDetalle', text: obj.ip },
                  { style: 'itemsTableDetalle', text: obj.original_data },
                  { style: 'itemsTableDetalle', text: obj.new_data }
                ]
                return array
              })
            ]
          },
          layout: {
            fillColor: function (rowIndex) {
              return (rowIndex % 2 === 0) ? '#E5E7E9' : null;
            }
          },
        },
        { width: '*', text: '' },
      ]
    }

  }

  FuncionTituloColumna() {
    var arrayTitulos = [
      { text: 'FECHA', style: 'tableHeaderDetalle' },
      { text: 'HORA', style: 'tableHeaderDetalle' },
      { text: 'USUARIO', style: 'tableHeaderDetalle' },
      { text: 'OPERACIÓN', style: 'tableHeaderDetalle' },
      { text: 'REGISTRO', style: 'tableHeaderDetalle' },
      { text: 'IP', style: 'tableHeaderDetalle' },
      { text: 'REFERENCIA ANTERIOR', style: 'tableHeaderDetalle' },
      { text: 'REFERENCIA ACTUAL', style: 'tableHeaderDetalle' }
    ]
    return arrayTitulos
  }

  GenerarExcel(datos: any) {
    let accion = '';
    const wsl: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datos.map(obj => {
      if (obj.action === 'I') {
        accion = 'Insertar';
      }
      if (obj.action === 'U') {
        accion = 'Actualizar';
      }
      if (obj.action === 'D') {
        accion = 'Eliminar';
      }

      return {
        FECHA: obj.obj.action_tstamp.split('T')[0],
        HORA: obj.action_tstamp.split('T')[0].split('.')[0],
        USUARIO: obj.user_name,
        OPERACION: accion,
        REGISTRO: obj.table_name,
        IP: obj.ip,
        REFERENCIA_ANTERIOR: obj.observacion,
        REFERENCIA_ACTUAL: obj.new_data,
      }
    }));
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsl, 'Auditoria');
    xlsx.writeFile(wb, "Auditoria" + new Date().getTime() + '.xlsx');
  }

}
