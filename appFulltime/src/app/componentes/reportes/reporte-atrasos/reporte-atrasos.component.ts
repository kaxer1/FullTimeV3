import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
moment.locale('es');
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as xml from 'xml-js';
import * as FileSaver from 'file-saver';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorasExtrasRealesService } from 'src/app/servicios/reportes/horasExtrasReales/horas-extras-reales.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';

@Component({
  selector: 'app-reporte-atrasos',
  templateUrl: './reporte-atrasos.component.html',
  styleUrls: ['./reporte-atrasos.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class ReporteAtrasosComponent implements OnInit {

  // Datos del Empleado Timbre
  empleado: any = [];
  nacionalidades: any = [];

  // Arreglo datos contrato actual
  datosContratoA: any = [];

  // Arreglo datos cargo actual
  datosCargoA: any = [];

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
    public router: Router,
    private toastr: ToastrService,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerNacionalidades();
    this.ObtenerEmpleadoLogueado(this.idEmpleado);
    this.VerDatosEmpleado();
  }

  // Método para ver la información del empleado 
  ObtenerEmpleadoLogueado(idemploy: any) {
    this.empleadoLogueado = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoLogueado = data;
      console.log('emple', this.empleadoLogueado)
    })
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

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

  VerAtrasosEmpleado(id_seleccionado, form, archivo) {
    if (form.inicioForm === '' || form.finalForm === '') {
      this.toastr.info('Ingresar fechas de periodo de búsqueda.', 'VERIFICAR DATOS DE FECHA')
    }
    else {
      if (Date.parse(form.inicioForm) <= Date.parse(form.finalForm)) {
        let fechas = {
          fechaInicio: form.inicioForm,
          fechaFinal: form.finalForm
        }
        this.VerAtrasosHorario(id_seleccionado, fechas, archivo, form);
      }
      else {
        this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR');
      }
    }
  }

  atrasosHorario: any = [];
  atrasosPlanificacion: any = [];
  totalAtrasos: any = [];
  VerAtrasosHorario(id_seleccionado, datosFecha, archivo, form) {
    this.atrasosHorario = [];
    this.atrasosPlanificacion = [];
    this.totalAtrasos = [];
    this.restR.ObtenerTimbresAtrasosHorario(id_seleccionado, datosFecha).subscribe(dataH => {
      this.atrasosHorario = dataH;
      this.VerAtrasosPlanificacion(this.atrasosHorario, id_seleccionado, archivo, datosFecha, form);
    }, error => {
      this.VerAtrasosPlanificacion(this.atrasosHorario, id_seleccionado, archivo, datosFecha, form);
    });
  }

  VerAtrasosPlanificacion(atrasos_horario: any, id_seleccionado: number, archivo: string, datos_fechas, form) {
    this.restR.ObtenerTimbresAtrasosPlanificacion(id_seleccionado, datos_fechas).subscribe(dataP => {
      this.atrasosPlanificacion = dataP;
      if (atrasos_horario.length != 0) {
        atrasos_horario = atrasos_horario.concat(this.atrasosPlanificacion);
        this.totalAtrasos = atrasos_horario;
        console.log('prueba', this.totalAtrasos);
      }
      else {
        this.totalAtrasos = this.atrasosPlanificacion;
        console.log('prueba1', this.totalAtrasos);
      }
      // this.totalAtrasos = this.totalAtrasos.sort((a, b) => new Date(a.fec_hora_timbre) > new Date(b.fec_hora_timbre));
      this.GenerarArchivos(id_seleccionado, archivo, form);
      this.LimpiarFechas();
      this.LimpiarCampos();
    }, error => {
      if (atrasos_horario.length != 0) {
        this.totalAtrasos = atrasos_horario;
        console.log('prueba2', this.totalAtrasos);
        //  this.totalAtrasos = this.totalAtrasos.sort((a, b) => new Date(a.fec_hora_timbre) > new Date(b.fec_hora_timbre));
        this.GenerarArchivos(id_seleccionado, archivo, form);
        this.LimpiarFechas();
        this.LimpiarCampos();
      }
      else {
        this.toastr.info('El empleado no tiene registros de Atrasos.')
      }
    })
  }

  GenerarArchivos(id_seleccionado: number, archivo: string, form) {
    if (archivo === 'pdf') {
      console.log('archivo', archivo)
      this.generarPdf('open', id_seleccionado, form);
    }
    else if (archivo === 'excel') {
      this.exportToExcel(this.atrasosHorario);
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

  ObtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
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
    console.log('comprobando', this.empleadoLogueado, id_seleccionado);
    return {

      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

      footer: function (currentPage, pageCount, fecha) {
        var f = new Date();
        if (f.getMonth() < 10 && f.getDate() < 10) {
          fecha = f.getFullYear() + "-0" + [f.getMonth() + 1] + "-0" + f.getDate();
        } else if (f.getMonth() >= 10 && f.getDate() >= 10) {
          fecha = f.getFullYear() + "-" + [f.getMonth() + 1] + "-" + f.getDate();
        } else if (f.getMonth() < 10 && f.getDate() >= 10) {
          fecha = f.getFullYear() + "-0" + [f.getMonth() + 1] + "-" + f.getDate();
        } else if (f.getMonth() >= 10 && f.getDate() < 10) {
          fecha = f.getFullYear() + "-" + [f.getMonth() + 1] + "-0" + f.getDate();
        }
        var time = f.getHours() + ':' + f.getMinutes();
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha + ' Hora: ' + time, ,
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
        ...this.datosEmpleado.map(obj => {
          if (obj.id === id_seleccionado) {
            return [
              {
                text: obj.empresa.toUpperCase(),
                bold: true,
                fontSize: 25,
                alignment: 'center',
                margin: [0, 0, 0, 20]
              },
              {
                text: 'REPORTE ATRASOS',
                fontSize: 17,
                alignment: 'center',
                margin: [0, 0, 0, 20]
              },
            ];
          }
        }),
        this.presentarDatosGenerales(id_seleccionado, form),
        this.presentarAtrasos(),
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
          fontSize: 10,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 8
        },
        itemsTableD: {
          fontSize: 9,
          alignment: 'center'
        },
        itemsTableI: {
          fontSize: 9,
          alignment: 'left',
          margin: [50, 5, 5, 5]
        },
        itemsTableP: {
          fontSize: 9,
          alignment: 'left',
          bold: true,
          margin: [50, 5, 5, 5]
        },
        tableHeaderA: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED',
          margin: [20, 0, 20, 0],
        },
        itemsTableC: {
          fontSize: 9,
          alignment: 'center',
          margin: [50, 5, 5, 5]
        },
      }
    };
  }

  presentarDatosGenerales(id_seleccionado, form) {
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo;
    var tiempoTotal: string, horaF: string, minF: string, secondF: string;
    var minTDecimal, horaTDecimal, minTDecimalH, horaTDecimalH, diasDecimal, trabaja;
    var day, hora1, hora2, hTrabajo, formatoHorasDecimal: number = 0, formatoDiasDecimal: number = 0;
    var tHoras = 0, tMinutos = 0, tSegudos = 0, formatoHorasEntero;
    var t1 = new Date();
    var t2 = new Date();
    var t3 = new Date();
    this.datosEmpleado.forEach(obj => {
      if (obj.id === id_seleccionado) {
        nombre = obj.nombre
        apellido = obj.apellido
        cedula = obj.cedula
        codigo = obj.codigo
        sucursal = obj.sucursal
        departamento = obj.departamento
        ciudad = obj.ciudad
        cargo = obj.cargo
      }
    })
    this.totalAtrasos.forEach(obj => {
      day = moment(obj.fec_hora_timbre).day();
      hora1 = (moment(obj.fec_hora_timbre).format('HH:mm:ss')).split(":");
      hora2 = (obj.hora_total).split(":")
      t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
      t2.setHours(parseInt(hora2[0]), parseInt(hora2[1]), parseInt(hora2[2]));
      //Aquí hago la resta
      t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
      // Establecer formato de hora
      console.log('horas', t1.getHours());
      tHoras = tHoras + t1.getHours();
      console.log('horas', tHoras);
      tSegudos = tSegudos + t1.getSeconds();
      tMinutos = tMinutos + t1.getMinutes();
      if (tHoras < 10) {
        horaF = '0' + tHoras;
      }
      else {
        horaF = String(tHoras);
      }
      if (tMinutos < 10) {
        minF = '0' + tMinutos;
      }
      else {
        minF = String(tMinutos);
      }
      if (tSegudos < 10) {
        secondF = '0' + tSegudos;
      }
      else {
        secondF = String(tSegudos);
      }
      tiempoTotal = horaF + ':' + minF + ':' + secondF;

      minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
      horaTDecimal = (minTDecimal / 60) + t1.getHours();
      console.log('hora decimal', horaTDecimal);
      formatoHorasDecimal = formatoHorasDecimal + parseFloat(horaTDecimal.toFixed(2));
      console.log('total hora decimal', formatoHorasDecimal);
      formatoHorasEntero = parseFloat('0.' + String(formatoHorasDecimal).split('.')[1]) * 60

      if ((obj.horario_horas).split(":")[1] != undefined) {
        trabaja = obj.horario_horas + ':00'
      }
      else {
        trabaja = obj.horario_horas + ':00:00'
      }
      var hTrabajo = (trabaja).split(":")
      var t3 = new Date();
      t3.setHours(parseInt(hTrabajo[0]), parseInt(hTrabajo[1]), parseInt(hTrabajo[2]));
      minTDecimalH = (t3.getSeconds() * 60) + t3.getMinutes();
      horaTDecimalH = (minTDecimalH / 60) + t3.getHours();
      diasDecimal = horaTDecimal / horaTDecimalH;
      formatoDiasDecimal = formatoDiasDecimal + parseFloat(diasDecimal.toFixed(2));
      console.log('total dias decimal', formatoDiasDecimal);
    })
    var diaI = moment(form.inicioForm).day();
    var diaF = moment(form.finalForm).day();
    return {
      table: {
        widths: ['*'],
        body: [
          [
            { text: 'INFORMACIÓN GENERAL EMPLEADO', style: 'tableHeader' },
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'CIUDAD: ' + ciudad, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'PERIODO DEL: ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableP'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'N° REGISTROS: ' + this.totalAtrasos.length, style: 'itemsTableI'
                    }
                  ]
                },
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'APELLIDOS: ' + apellido, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'NOMBRES: ' + nombre, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'CÉDULA: ' + cedula, style: 'itemsTableI'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'CÓDIGO: ' + codigo, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'SUCURSAL: ' + sucursal, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'DEPARTAMENTO: ' + departamento, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'CARGO: ' + cargo, style: 'itemsTableI'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    { width: '*', text: '' },
                    {
                      width: 'auto',
                      layout: 'lightHorizontalLines',
                      table: {
                        widths: ['auto'],
                        body: [
                          [
                            { text: 'DATOS TOTALES FORMATO DECIMAL', style: 'tableHeaderA' },
                          ]
                        ]
                      }
                    },
                    { width: '*', text: '' },
                  ]
                },
                {
                  columns: [
                    { width: '*', text: '' },
                    {
                      width: 'auto',
                      layout: 'lightHorizontalLines',
                      table: {
                        widths: ['auto'],
                        body: [
                          [
                            { text: 'DATOS TOTALES FORMATO GENERAL', style: 'tableHeaderA' },
                          ]
                        ]
                      }
                    },
                    { width: '*', text: '' },
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'TOTAL EN DIAS: ' + formatoDiasDecimal.toFixed(2), style: 'itemsTableC'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'TOTAL EN HORAS: ' + formatoHorasDecimal, style: 'itemsTableC'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'TOTAL HORAS: ' + String(formatoHorasDecimal).split('.')[0] + ' hh : ' + formatoHorasEntero.toFixed(0) + ' min', style: 'itemsTableC'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: '', style: 'itemsTableC'
                    }
                  ]
                },
              ]
            }
          ],
          [
            { text: 'LISTA DE ATRASOS PERIODO DEL ' + moment.weekdays(diaI).toUpperCase() + ' ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + moment.weekdays(diaF).toUpperCase() + ' ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'tableHeader' },
          ],
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

  presentarAtrasos() {
    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
        body: [
          [
            { text: 'FECHA', style: 'tableHeader' },
            { text: 'HORARIO', style: 'tableHeader' },
            { text: 'MM TOLERANCIA', style: 'tableHeader' },
            { text: 'HORA TIMBRE', style: 'tableHeader' },
            { text: 'HH TRABAJO', style: 'tableHeader' },
            { text: 'ATRASO', style: 'tableHeader' },
            { text: 'HORAS', style: 'tableHeader' },
            { text: 'DÍAS', style: 'tableHeader' },
          ],
          ...this.totalAtrasos.map(obj => {
            var tiempoTotal: string, horaF: string, minF: string, secondF: string;
            var minTDecimal, horaTDecimal, minTDecimalH, horaTDecimalH, diasDecimal, trabaja;
            var day = moment(obj.fec_hora_timbre).day();
            var hora1 = (moment(obj.fec_hora_timbre).format('HH:mm:ss')).split(":");
            var hora2 = (obj.hora_total).split(":")
            var t1 = new Date();
            var t2 = new Date();
            t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
            t2.setHours(parseInt(hora2[0]), parseInt(hora2[1]), parseInt(hora2[2]));
            //Aquí hago la resta
            t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
            // Establecer formato de hora
            if (t1.getHours() < 10) {
              horaF = '0' + t1.getHours();
            }
            else {
              horaF = String(t1.getHours());
            }
            if (t1.getMinutes() < 10) {
              minF = '0' + t1.getMinutes();
            }
            else {
              minF = String(t1.getMinutes());
            }
            if (t1.getSeconds() < 10) {
              secondF = '0' + t1.getSeconds();
            }
            else {
              secondF = String(t1.getSeconds());
            }
            tiempoTotal = horaF + ':' + minF + ':' + secondF;
            minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
            horaTDecimal = (minTDecimal / 60) + t1.getHours();
            if ((obj.horario_horas).split(":")[1] != undefined) {
              trabaja = obj.horario_horas + ':00'
            }
            else {
              trabaja = obj.horario_horas + ':00:00'
            }
            var hTrabajo = (trabaja).split(":")
            var t3 = new Date();
            t3.setHours(parseInt(hTrabajo[0]), parseInt(hTrabajo[1]), parseInt(hTrabajo[2]));
            minTDecimalH = (t3.getSeconds() * 60) + t3.getMinutes();
            horaTDecimalH = (minTDecimalH / 60) + t3.getHours();
            diasDecimal = horaTDecimal / horaTDecimalH;
            return [
              { text: moment.weekdays(day).charAt(0).toUpperCase() + moment.weekdays(day).slice(1) + ' ' + moment(obj.fec_hora_timbre).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: obj.hora, style: 'itemsTableD' },
              { text: obj.minu_espera + ' min', style: 'itemsTableD' },
              { text: moment(obj.fec_hora_timbre).format('HH:mm:ss'), style: 'itemsTableD' },
              { text: obj.horario_horas, style: 'itemsTableD' },
              { text: tiempoTotal, style: 'itemsTableD' },
              { text: horaTDecimal.toFixed(2), style: 'itemsTableD' },
              { text: diasDecimal.toFixed(2), style: 'itemsTableD' },
            ];
          })
        ]
      }
    };
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL
   * ****************************************************************************************************/

  exportToExcel(datos_timbres) {
    datos_timbres.forEach(obj => {
      var fecha = moment(obj.fec_hora_timbre).format('DD/MM/YYYY') + ' ' + moment(obj.fec_hora_timbre).format('HH:mm:ss');
      obj.fec_hora_timbre = fecha;
    });
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(datos_timbres);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'timbresEmpleado');
    xlsx.writeFile(wb, "TimbresEmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/
  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloEmpleado = [];
    this.empleado.forEach(obj => {
      let nacionalidad;
      this.nacionalidades.forEach(element => {
        if (obj.id_nacionalidad == element.id) {
          nacionalidad = element.nombre;
        }
      });

      objeto = {
        "empleado": {
          '@id': obj.id,
          "cedula": obj.cedula,
          "apellido": obj.apellido,
          "nombre": obj.nombre,


          "correo": obj.correo,
          "fechaNacimiento": obj.fec_nacimiento.split("T")[0],

          "correoAlternativo": obj.mail_alternativo,
          "domicilio": obj.domicilio,
          "telefono": obj.telefono,
          "nacionalidad": nacionalidad,
          "imagen": obj.imagen
        }
      }
      arregloEmpleado.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloEmpleado).subscribe(res => {
      console.log(arregloEmpleado)
      this.data = res;
      console.log("prueba-empleado", res)
      this.urlxml = 'http://localhost:3000/empleado/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleado);
    const csvDataC = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpleadosCSV" + new Date().getTime() + '.csv');
  }

}
