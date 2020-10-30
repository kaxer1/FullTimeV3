import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
// Librería para manejar fechas
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
  selector: 'app-reporte-permisos',
  templateUrl: './reporte-permisos.component.html',
  styleUrls: ['./reporte-permisos.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class ReportePermisosComponent implements OnInit {

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
    public restGeneral: DatosGeneralesService,
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

  // Método para manejo de paginación
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Obtener lista de empleados que tienen datos de contrato y cargo
    VerDatosEmpleado() {
    this.datosEmpleado = [];
    this.restGeneral.ListarInformacionActual().subscribe(data => {
      this.datosEmpleado = data;
      console.log('datos_actuales', this.datosEmpleado)
    });
  }

  // Obtener datos de permiso del empleado de acuerdo al horario
  datosAutorizacion: any = [];
  permisosHorarios: any = [];
  permisosPlanificacion: any = [];
  totalPermisos: any = [];
  VerPermisosEmpleado(id_seleccionado, archivo, form) {
    this.permisosHorarios = [];
    this.permisosPlanificacion = [];
    this.totalPermisos = [];
    this.restR.ObtenerPermisosHorarios(id_seleccionado).subscribe(dataH => {
      this.permisosHorarios = dataH;
      this.VerPermisosPlanificacion(this.permisosHorarios, id_seleccionado, archivo, form);
    }, error => {
      this.VerPermisosPlanificacion(this.permisosHorarios, id_seleccionado, archivo, form);
    });
  }

  // Obtener datos de permisos del empleado de acuerdo a la planificación
  VerPermisosPlanificacion(permisos_horario: any, id_seleccionado: number, archivo: string, form) {
    this.restR.ObtenerPermisosPlanificacion(id_seleccionado).subscribe(dataP => {
      this.permisosPlanificacion = dataP;
      if (permisos_horario.length != 0) {
        permisos_horario = permisos_horario.concat(this.permisosPlanificacion);
        this.totalPermisos = permisos_horario;
        this.OrdenarDatos(this.totalPermisos);
        console.log('prueba', this.totalPermisos);
      }
      else {
        this.totalPermisos = this.permisosPlanificacion;
        this.OrdenarDatos(this.totalPermisos);
        console.log('prueba1', this.totalPermisos);
      }
      this.VerDatosAutorizacion(id_seleccionado, archivo, form);
    }, error => {
      if (permisos_horario.length != 0) {
        this.totalPermisos = permisos_horario;
        this.OrdenarDatos(this.totalPermisos);
        console.log('prueba2', this.totalPermisos);
        this.VerDatosAutorizacion(id_seleccionado, archivo, form);
      }
      else {
        this.toastr.info('El empleado no tiene registros de PERMISOS.')
      }
    })
  }

  // Ordenar los datos según el número de permiso
  OrdenarDatos(array) {
    function compare(a, b) {
      if (a.num_permiso < b.num_permiso) {
        return -1;
      }
      if (a.num_permiso > b.num_permiso) {
        return 1;
      }
      return 0;
    }
    array.sort(compare);
  }

  // Obtener datos de la autorización de los permisos
  consultaAutoriza: any = [];
  verificar: number = 0;
  VerDatosAutorizacion(id_seleccionado: number, archivo: string, form) {
    // Guardamos los datos de la autorización de los permisos del empleado
    this.consultaAutoriza = [];
    this.restR.ObtenerAutorizacionPermiso(id_seleccionado).subscribe(dataA => {
      this.consultaAutoriza = dataA;
      // Este parametro nos permite verificar si ya recorrimos todo el array de datos
      this.verificar = 0;
      // Recorremos el array de datos para cambiar el estado
      this.consultaAutoriza.map(obj => {
        this.verificar = this.verificar + 1;
        if (obj.estado === 1) {
          obj.estado = 'Pendiente';
        }
        else if (obj.estado === 2) {
          obj.estado = 'Pre-autorizado';
        }
        else if (obj.estado === 3) {
          obj.estado = 'Autorizado';
        }
        else if (obj.estado === 4) {
          obj.estado = 'Negado';
        }
        // Obtenemos el id del empleado que realizo el cambio de estado a la autorización
        var autorizaciones = obj.empleado_estado.split(',');
        let empleado_id = autorizaciones[autorizaciones.length - 2].split('_')[0];
        // Buscamos los respectivos datos del id del empleado encontrado
        this.restGeneral.AutorizaEmpleado(parseInt(empleado_id)).subscribe(dataE => {
          // Creamos un array de dato en el que incluios el nombre del empleado que autorizo el permiso
          let datosAutoriza = [{
            empleado_estado: obj.empleado_estado,
            estado: obj.estado,
            id_autoriza: obj.id_autoriza,
            id_empl_contrato: obj.id_empl_contrato,
            id_empleado: obj.id_empleado,
            id_permiso: obj.id_permiso,
            autorizado_por: dataE[0].e_nombre + ' ' + dataE[0].e_apellido
          }]
          // LLenamos el array de todos los datos encontrados
          if (this.datosAutorizacion.length == 0) {
            this.datosAutorizacion = datosAutoriza;
          } else {
            this.datosAutorizacion = this.datosAutorizacion.concat(datosAutoriza)
          }
          // Verificamos si ya estan todos los datos y pasamos a generar los archivos
          if (this.verificar === this.consultaAutoriza.length) {
            this.verificar = 0;
            if (archivo === 'pdf') {
              console.log('archivo', archivo)
              this.generarPdf('open', id_seleccionado);
            }
            else if (archivo === 'excel') {
              this.exportToExcel(id_seleccionado, form);
            }
          }
        });
      })
    })
  }

  // Obtención de los permisos de acuerdo horario y al periodo de fechas indicado
  VerPermisosEmpleadoFecha(id_seleccionado, archivo, fechas, form) {
    this.permisosHorarios = [];
    this.permisosPlanificacion = [];
    this.totalPermisos = [];
    this.restR.ObtenerPermisosHorariosFechas(id_seleccionado, fechas).subscribe(dataH => {
      this.permisosHorarios = dataH;
      this.VerPermisosPlanificacionFecha(this.permisosHorarios, id_seleccionado, archivo, fechas, form);
    }, error => {
      this.VerPermisosPlanificacionFecha(this.permisosHorarios, id_seleccionado, archivo, fechas, form);
    });
  }

  // Obtención de los permisos de acuerdo a la planificación y al periodo de fechas indicado 
  VerPermisosPlanificacionFecha(permisos_horario: any, id_seleccionado: number, archivo: string, fechas, form) {
    this.restR.ObtenerPermisosPlanificacionFechas(id_seleccionado, fechas).subscribe(dataP => {
      this.permisosPlanificacion = dataP;
      if (permisos_horario.length != 0) {
        permisos_horario = permisos_horario.concat(this.permisosPlanificacion);
        this.totalPermisos = permisos_horario;
        this.OrdenarDatos(this.totalPermisos);
        console.log('prueba', this.totalPermisos);
      }
      else {
        this.totalPermisos = this.permisosPlanificacion;
        this.OrdenarDatos(this.totalPermisos);
        console.log('prueba1', this.totalPermisos);
      }
      this.VerDatosAutorizacion(id_seleccionado, archivo, form);
    }, error => {
      if (permisos_horario.length != 0) {
        this.totalPermisos = permisos_horario;
        this.OrdenarDatos(this.totalPermisos);
        console.log('prueba2', this.totalPermisos);
        this.VerDatosAutorizacion(id_seleccionado, archivo, form);
      }
      else {
        this.toastr.info('El empleado no tiene registros de PERMISOS.')
      }
    })
  }

  // Método para controlar ingreso adecuado de periodo de fechas
  VerPermisos(form, archivo, id_seleccionado) {
    if (form.inicioForm === '' && form.finalForm === '' || form.inicioForm === null && form.finalForm === null) {
      this.VerPermisosEmpleado(id_seleccionado, archivo, form);
    }
    else {
      if (form.inicioForm === '' || form.finalForm === '') {
        this.toastr.info('Ingresar las dos fechas de periodo de búsqueda.', 'VERIFICAR DATOS DE FECHA')
      }
      else {
        console.log('fechas', form.inicioForm)
        if (Date.parse(form.inicioForm) <= Date.parse(form.finalForm)) {
          var fechas = {
            fechaInicio: form.inicioForm,
            fechaFinal: form.finalForm
          }
          this.VerPermisosEmpleadoFecha(id_seleccionado, archivo, fechas, form);
          this.LimpiarFechas();
        }
        else {
          this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR');
        }
      }
    }
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

  // Método para limpiar campos de búsqueda
  LimpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
    this.departamentoF.reset();
    this.regimenF.reset();
    this.cargoF.reset();
  }

  // Método para limpiar campos de fecha
  LimpiarFechas() {
    this.fechaInicialF.reset();
    this.fechaFinalF.reset();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

  generarPdf(action = 'open', id_seleccionado) {
    const documentDefinition = this.getDocumentDefinicion(id_seleccionado);

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion(id_seleccionado: number) {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);
    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        // Método de obtención de fecha y hora actual
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
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Glosario de Términos: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'DD = ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Días de Permiso ', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'HH:MM = ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Horas y minutos de permiso ', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'HH = ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Horas Laborables ', border: [false, false, false, false], style: ['quote', 'small'] },

                ]
              ]
            }
          },
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
      // Título del archivo y sumatoria de cálculos
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        ...this.datosEmpleado.map(obj => {
          if (obj.id === id_seleccionado) {
            return [
              { text: obj.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 5] },
              { text: 'REPORTE GENERAL DE PERMISOS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 5] },
            ];
          }
        }),
        this.presentarDatosGenerales(id_seleccionado),
        this.presentarPermisos(),
      ],

      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTableC: { fontSize: 9, alignment: 'center', margin: [50, 5, 5, 5] },
        tableHeaderF: { fontSize: 9, bold: true, alignment: 'center', fillColor: this.s_color, },
        itemsTableS: { fontSize: 9, alignment: 'center', },
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 9, opacity: 0.3 }
      }
    };
  }

  // Datos Generales del empleado del que se obtiene el reporte y sumatoria de cálculos realizados

  datosEmpleadoAutoriza: any = [];
  presentarDatosGenerales(id_seleccionado) {
    var ciudad, nombre, apellido, cedula, codigo, regimen, sucursal, departamento, cargo, totalDias = 0, totalHoras = 0, formatoHoras = '0', formatoMinutos;
    var estado, horas_decimal, dias_decimal, horas_horario, minutosHoras, tDias, horasDias, horaT, horaTDecimalH;
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
    })
    this.totalPermisos.forEach(obj => {
      console.log('auto', this.datosAutorizacion)
      this.datosAutorizacion.forEach(element => {
        if (obj.id === element.id_permiso) {
          estado = element.estado;
          if (estado === 'Autorizado') {
            var hora1 = (obj.hora_numero).split(":");
            var t1 = new Date();
            t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
            var minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
            horas_decimal = (minTDecimal / 60) + t1.getHours();
            if ((obj.horario_horas).split(":")[1] != undefined) {
              horas_horario = obj.horario_horas + ':00'
            }
            else {
              horas_horario = obj.horario_horas + ':00:00'
            }
            var hTrabajo = (horas_horario).split(":")
            var t3 = new Date();
            t3.setHours(parseInt(hTrabajo[0]), parseInt(hTrabajo[1]), parseInt(hTrabajo[2]));
            var minTDecimalH = (t3.getSeconds() * 60) + t3.getMinutes();
            horaTDecimalH = (minTDecimalH / 60) + t3.getHours();
            horaT = horas_decimal + (horaTDecimalH * obj.dia);
            dias_decimal = horaT / horaTDecimalH;
            totalHoras = totalHoras + horaT;
            totalDias = totalDias + dias_decimal;
          }
        }
      });
    });
    // Realización de cálculos
    minutosHoras = parseFloat('0.' + String(totalHoras).split('.')[1]) * 60;
    tDias = parseFloat('0.' + String(totalDias).split('.')[1]) * horaTDecimalH;
    horasDias = parseFloat('0.' + String(tDias).split('.')[1]) * 60;

    // Control de escritura de horas y minutos
    if (parseInt(String(tDias).split('.')[0]) < 10) {
      formatoHoras = '0' + parseInt(String(tDias).split('.')[0]);
    }
    else {
      formatoHoras = String(parseInt(String(tDias).split('.')[0]));
    }

    if (formatoHoras === 'NaN') {
      formatoHoras = '0';
    }

    if (horasDias.toFixed(0) < 10) {
      formatoMinutos = '0' + horasDias.toFixed(0);
    }
    else {
      formatoMinutos = horasDias.toFixed(0);
    }

    if (minutosHoras.toFixed(0) > 10) {
      minutosHoras = minutosHoras.toFixed(0);
    }
    else {
      minutosHoras = '0' + minutosHoras.toFixed(0);
    }
    // Estructura del PDF
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
              { text: [{ text: 'N° DE PERMISOS: ' + this.totalPermisos.length, style: 'itemsTableI' }] },
            ]
          }],
          [{
            border: [false, false, false, false],
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: 'SUMATORIA TOTAL DE PERMISOS EN DIAS Y HORAS FORMATO DECIMAL', style: 'tableHeaderF' },
                  { text: 'SUMATORIA TOTAL DE PERMISOS EN DIAS Y HORAS FORMATO GENERAL', style: 'tableHeaderF' },
                ],
                [
                  { text: 'TOTAL DE PERMISOS EN DÍAS DECIMAL: ' + totalDias.toFixed(3), style: 'itemsTableS' },
                  { text: 'TOTAL DE DÍAS Y HORAS DE PERMISO: ' + String(totalDias).split('.')[0] + ' días ' + ' ' + formatoHoras + ' horas: ' + formatoMinutos + ' minutos', style: 'itemsTableS' }
                ],
                [
                  { text: 'TOTAL DE PERMISOS EN HORAS DECIMAL: ' + totalHoras.toFixed(3), style: 'itemsTableS' },
                  { text: 'TOTAL DE HORAS Y MINUTOS DE PERMISO: ' + String(totalHoras.toFixed(3)).split('.')[0] + ' horas : ' + minutosHoras + ' minutos', style: 'itemsTableS' }
                ],
              ]
            },
            layout: {
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
              },
              paddingLeft: function (i, node) { return 10; },
              paddingRight: function (i, node) { return 10; },
              paddingTop: function (i, node) { return 10; },
              paddingBottom: function (i, node) { return 10; }
            }
          }],
          [{ text: 'LISTA DE PERMISOS', style: 'tableHeader' },],
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
      },
    }
  }

  // Estructura de lista de permisos registrados por el empleado
  presentarPermisos() {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto'],
        body: [
          [
            { text: 'N° PERMISO', style: 'tableHeader' },
            { text: 'SOLICITADO', style: 'tableHeader' },
            { text: 'TIPO', style: 'tableHeader' },
            { text: 'DESDE', style: 'tableHeader' },
            { text: 'HASTA', style: 'tableHeader' },
            { text: 'DD', style: 'tableHeader' },
            { text: 'HH:MM', style: 'tableHeader' },
            { text: 'HH. TRABAJO', style: 'tableHeader' },
            { text: 'ESTADO', style: 'tableHeader' },
            { text: 'AUTORIZA', style: 'tableHeader' },
            { text: 'HORAS', style: 'tableHeader' },
            { text: 'DÍAS', style: 'tableHeader' },
          ],
          ...this.totalPermisos.map(obj => {
            var estado = '', horas_decimal, dias_decimal, horaT, trabaja, empleadoAutoriza = '';
            for (var i = 0; i <= this.datosAutorizacion.length - 1; i++) {
              if (obj.id === this.datosAutorizacion[i].id_permiso) {
                estado = this.datosAutorizacion[i].estado;
                if (estado === 'Autorizado') {
                  empleadoAutoriza = this.datosAutorizacion[i].autorizado_por;
                  // Realización de cálculos
                  var hora1 = (obj.hora_numero).split(":");
                  var t1 = new Date();
                  t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
                  var minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
                  horas_decimal = (minTDecimal / 60) + t1.getHours();

                  // Obtención de las horas de trabajo en días
                  if ((obj.horario_horas).split(":")[1] != undefined) {
                    trabaja = obj.horario_horas + ':00'
                  }
                  else {
                    trabaja = obj.horario_horas + ':00:00'
                  }
                  var hTrabajo = (trabaja).split(":")
                  var t3 = new Date();
                  t3.setHours(parseInt(hTrabajo[0]), parseInt(hTrabajo[1]), parseInt(hTrabajo[2]));
                  var minTDecimalH = (t3.getSeconds() * 60) + t3.getMinutes();
                  var horaTDecimalH = (minTDecimalH / 60) + t3.getHours();
                  horaT = horas_decimal + (horaTDecimalH * obj.dia);
                  dias_decimal = horaT / horaTDecimalH;
                  horaT = horaT.toFixed(3);
                  dias_decimal = dias_decimal.toFixed(3);
                }
                else {
                  empleadoAutoriza = this.datosAutorizacion[i].autorizado_por;
                }
                break
              } else {
                if (obj.estado === 1) {
                  estado = 'Pendiente'
                }
                else if (obj.estado === 2) {
                  estado = 'Pre-autorizado'
                }
                else if (obj.estado === 3) {
                  estado = 'Autorizado'
                }
                else if (obj.estado === 4) {
                  estado = 'Negado'
                }
              }
            }
            return [
              { text: obj.num_permiso, style: 'itemsTableD' },
              { text: moment(obj.fec_creacion).format("DD/MM/YYYY"), style: 'itemsTableD' },
              { text: obj.nombre_permiso, style: 'itemsTableD' },
              { text: String(moment(obj.fec_inicio, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableD' },
              { text: String(moment(obj.fec_final, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableD' },
              { text: obj.dia, style: 'itemsTableD' },
              { text: obj.hora_numero, style: 'itemsTableD' },
              { text: obj.horario_horas, style: 'itemsTableD' },
              { text: estado, style: 'itemsTableD' },
              { text: empleadoAutoriza, style: 'itemsTableD' },
              { text: horaT, style: 'itemsTableD' },
              { text: dias_decimal, style: 'itemsTableD' },
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
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL
   * ****************************************************************************************************/

  exportToExcel(id_empleado, form) {
    var totalDias = 0, totalHoras = 0, formatoHoras = '0', formatoMinutos;
    var estado, horas_decimal, dias_decimal, horas_horario, minutosHoras, tDias, horasDias, horaT, horaTDecimalH;

    this.totalPermisos.forEach(obj => {
      console.log('auto', this.datosAutorizacion)
      this.datosAutorizacion.forEach(element => {
        if (obj.id === element.id_permiso) {
          estado = element.estado;
          if (estado === 'Autorizado') {
            var hora1 = (obj.hora_numero).split(":");
            var t1 = new Date();
            t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
            var minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
            horas_decimal = (minTDecimal / 60) + t1.getHours();
            if ((obj.horario_horas).split(":")[1] != undefined) {
              horas_horario = obj.horario_horas + ':00'
            }
            else {
              horas_horario = obj.horario_horas + ':00:00'
            }
            var hTrabajo = (horas_horario).split(":")
            var t3 = new Date();
            t3.setHours(parseInt(hTrabajo[0]), parseInt(hTrabajo[1]), parseInt(hTrabajo[2]));
            var minTDecimalH = (t3.getSeconds() * 60) + t3.getMinutes();
            horaTDecimalH = (minTDecimalH / 60) + t3.getHours();
            horaT = horas_decimal + (horaTDecimalH * obj.dia);
            dias_decimal = horaT / horaTDecimalH;
            totalHoras = totalHoras + horaT;
            totalDias = totalDias + dias_decimal;
          }
        }
      });
    });
    // Realización de cálculos
    minutosHoras = parseFloat('0.' + String(totalHoras).split('.')[1]) * 60;
    tDias = parseFloat('0.' + String(totalDias).split('.')[1]) * horaTDecimalH;
    horasDias = parseFloat('0.' + String(tDias).split('.')[1]) * 60;

    // Control de escritura de horas y minutos
    if (parseInt(String(tDias).split('.')[0]) < 10) {
      formatoHoras = '0' + parseInt(String(tDias).split('.')[0]);
    }
    else {
      formatoHoras = String(parseInt(String(tDias).split('.')[0]));
    }

    if (formatoHoras === 'NaN') {
      formatoHoras = '0';
    }

    if (horasDias.toFixed(0) < 10) {
      formatoMinutos = '0' + horasDias.toFixed(0);
    }
    else {
      formatoMinutos = horasDias.toFixed(0);
    }

    if (minutosHoras.toFixed(0) > 10) {
      minutosHoras = minutosHoras.toFixed(0);
    }
    else {
      minutosHoras = '0' + minutosHoras.toFixed(0);
    }
    for (var i = 0; i <= this.datosEmpleado.length - 1; i++) {
      if (this.datosEmpleado[i].id === id_empleado) {
        var datosEmpleado = [{
          CODIGO: this.datosEmpleado[i].codigo,
          NOMBRE: this.datosEmpleado[i].nombre,
          APELLIDO: this.datosEmpleado[i].apellido,
          CEDULA: this.datosEmpleado[i].cedula,
          SUCURSAL: this.datosEmpleado[i].sucursal,
          DEPARTAMENTO: this.datosEmpleado[i].departamento,
          CIUDAD: this.datosEmpleado[i].ciudad,
          CARGO: this.datosEmpleado[i].cargo,
          REGIMEN: this.datosEmpleado[i].regimen,
          TOTAL_PERMISOS_DIAS_DECIMAL: parseFloat(totalDias.toFixed(3)),
          TOTAL_PERMISOS_HORAS_DECIMAL: parseFloat(totalHoras.toFixed(3)),
        }]
        break;
      }
    }
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datosEmpleado);

    const headerE = Object.keys(datosEmpleado[0]); // columns name

    var wscolsE = [];
    for (var i = 0; i < headerE.length; i++) {  // columns length added
      wscolsE.push({ wpx: 115 })
    }
    wse["!cols"] = wscolsE;

    const wsp: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.totalPermisos.map(obj => {
      var estado = '', horas_decimal, dias_decimal, horaT, trabaja, empleadoAutoriza = '';
      for (var i = 0; i <= this.datosAutorizacion.length - 1; i++) {
        if (obj.id === this.datosAutorizacion[i].id_permiso) {
          estado = this.datosAutorizacion[i].estado;
          if (estado === 'Autorizado') {
            empleadoAutoriza = this.datosAutorizacion[i].autorizado_por;
            // Realización de cálculos
            var hora1 = (obj.hora_numero).split(":");
            var t1 = new Date();
            t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
            var minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
            horas_decimal = (minTDecimal / 60) + t1.getHours();

            // Obtención de las horas de trabajo en días
            if ((obj.horario_horas).split(":")[1] != undefined) {
              trabaja = obj.horario_horas + ':00'
            }
            else {
              trabaja = obj.horario_horas + ':00:00'
            }
            var hTrabajo = (trabaja).split(":")
            var t3 = new Date();
            t3.setHours(parseInt(hTrabajo[0]), parseInt(hTrabajo[1]), parseInt(hTrabajo[2]));
            var minTDecimalH = (t3.getSeconds() * 60) + t3.getMinutes();
            var horaTDecimalH = (minTDecimalH / 60) + t3.getHours();
            horaT = horas_decimal + (horaTDecimalH * obj.dia);
            dias_decimal = horaT / horaTDecimalH;
            horaT = horaT.toFixed(3);
            dias_decimal = dias_decimal.toFixed(3);
          }
          else {
            empleadoAutoriza = this.datosAutorizacion[i].autorizado_por;
            horaT = 0.000;
            dias_decimal = 0.000;
          }
          break
        } else {
          if (obj.estado === 1) {
            estado = 'Pendiente'
          }
          else if (obj.estado === 2) {
            estado = 'Pre-autorizado'
          }
          else if (obj.estado === 3) {
            estado = 'Autorizado'
          }
          else if (obj.estado === 4) {
            estado = 'Negado'
          }
        }
      }
      return {
        N_PERMISOS: obj.num_permiso,
        FECHA_CREACION: moment(obj.fec_creacion).format("DD/MM/YYYY"),
        NOMBRE_PERMISO: obj.nombre_permiso,
        FECHA_INICIAL: String(moment(obj.fec_inicio, "YYYY/MM/DD").format("DD/MM/YYYY")),
        FECHA_FINAL: String(moment(obj.fec_final, "YYYY/MM/DD").format("DD/MM/YYYY")),
        DIAS_PERMISO: obj.dia,
        HORAS_PERMISO: obj.hora_numero,
        HORAS_LABORABLES: obj.horario_horas,
        ESTADO: estado,
        EMPLEADO_AUTORIZA: empleadoAutoriza,
        HORAS_TOTALES_DECIMAL: parseFloat(horaT),
        DIAS_TOTALES_DECIMAL: parseFloat(dias_decimal),
      };
    }));

    const header = Object.keys(this.totalPermisos[0]); // columns name

    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
      wscols.push({ wpx: 125 })
    }
    wsp["!cols"] = wscols;

    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'Empleado');
    xlsx.utils.book_append_sheet(wb, wsp, 'Permisos');
    if (form.inicioForm === '' || form.finalForm === '') {
      var f = moment();
      xlsx.writeFile(wb, "Permisos - " + f.format('YYYY-MM-DD') + '.xlsx');
    }
    else {
      xlsx.writeFile(wb, "Permisos - " + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' - ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + '.xlsx');
    }
  }

}
