import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
moment.locale('es');
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatDialog } from '@angular/material/dialog';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorasExtrasRealesService } from 'src/app/servicios/reportes/horasExtrasReales/horas-extras-reales.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

import { ConfigurarAtrasosComponent } from 'src/app/componentes/configurar-atrasos/configurar-atrasos.component';

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
    public restEmpre: EmpresaService,
    public vistaConfigurarAtraso: MatDialog,
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

  // Método para verificar ingreso correcto de periodo de fechas
  confirmado: boolean;
  ConfigurarAtrasos(id_seleccionado: any, form, archivo: string) {
    if (form.inicioForm === '' || form.finalForm === '') {
      this.toastr.info('Ingresar fechas de periodo de búsqueda.', 'VERIFICAR DATOS DE FECHA')
    }
    else {
      if (Date.parse(form.inicioForm) <= Date.parse(form.finalForm)) {
        let fechas = {
          fechaInicio: form.inicioForm,
          fechaFinal: form.finalForm
        }
        /** Función para indicar cálculo de atrasos*/
        this.vistaConfigurarAtraso.open(ConfigurarAtrasosComponent, { width: '450px' }).afterClosed()
          .subscribe((seleccion: string) => {
            if (seleccion === 'con') {
              this.confirmado = true;
              this.VerAtrasosHorario(id_seleccionado, fechas, archivo, form, this.confirmado);
            }
            else if (seleccion === 'sin') {
              this.confirmado = false;
              this.VerAtrasosHorario(id_seleccionado, fechas, archivo, form, this.confirmado);
            }
            else {
              this.router.navigate(['/reporteAtrasos']);
            }
          });
      }
      else {
        this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR');
      }
    }
  }

  // Método para obtener los atrasos del empleado de acuerdo al horario del empleado
  atrasosHorario: any = [];
  atrasosPlanificacion: any = [];
  totalAtrasos: any = [];
  VerAtrasosHorario(id_seleccionado, datosFecha, archivo, form, confirmado) {
    this.atrasosHorario = [];
    this.atrasosPlanificacion = [];
    this.totalAtrasos = [];
    this.restR.ObtenerTimbresAtrasosHorario(id_seleccionado, datosFecha).subscribe(dataH => {
      this.atrasosHorario = dataH;
      this.VerAtrasosPlanificacion(this.atrasosHorario, id_seleccionado, archivo, datosFecha, form, confirmado);
    }, error => {
      this.VerAtrasosPlanificacion(this.atrasosHorario, id_seleccionado, archivo, datosFecha, form, confirmado);
    });
  }

  // Método para obtener los atrasos del empleado de acuerdo a la planificación de horario del empleado
  VerAtrasosPlanificacion(atrasos_horario: any, id_seleccionado: number, archivo: string, datos_fechas, form, confirmado) {
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
      this.GenerarArchivos(id_seleccionado, archivo, form, confirmado);
      this.LimpiarFechas();
      this.LimpiarCampos();
    }, error => {
      if (atrasos_horario.length != 0) {
        this.totalAtrasos = atrasos_horario;
        console.log('prueba2', this.totalAtrasos);
        //  this.totalAtrasos = this.totalAtrasos.sort((a, b) => new Date(a.fec_hora_timbre) > new Date(b.fec_hora_timbre));
        this.GenerarArchivos(id_seleccionado, archivo, form, confirmado);
        this.LimpiarFechas();
        this.LimpiarCampos();
      }
      else {
        this.toastr.info('El empleado no tiene registros de Atrasos.')
      }
    })
  }

  // Método para generar los archivos de descarga
  GenerarArchivos(id_seleccionado: number, archivo: string, form, confirmado) {
    if (archivo === 'pdf') {
      console.log('archivo', archivo)
      this.generarPdf('open', id_seleccionado, form, confirmado);
    }
    else if (archivo === 'excel') {
      this.exportToExcel(this.atrasosHorario);
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

  // Método para limpiar campos de fecha 
  LimpiarFechas() {
    this.fechaInicialF.reset();
    this.fechaFinalF.reset();
  }


  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

  generarPdf(action = 'open', id_seleccionado, form, confirmado) {
    const documentDefinition = this.getDocumentDefinicion(id_seleccionado, form, confirmado);

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion(id_seleccionado: number, form, confirmado) {
    sessionStorage.setItem('Administrador', this.empleadoLogueado);

    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
      footer: function (currentPage, pageCount, fecha) {
        // Obtener fecha y hora actual
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
        // Formato de hora actual
        if (f.getMinutes() < 10) {
          var time = f.getHours() + ':0' + f.getMinutes();
        }
        else {
          var time = f.getHours() + ':' + f.getMinutes();
        }

        return [
        /*  {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'MM: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Minutos de Tolerancia.', border: [false, false, false, false], style: ['quote', 'small'], fontSize: 9, },],
                [
                  { text: 'HH: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Horas Laborables.', border: [false, false, false, false], style: ['quote', 'small'], fontSize: 9, },]
              ]
            }
          },*/
          {
            margin: [10, -2, 10, 0],
            columns: [
              {
                text: [{
                  text: 'Glosario de Terminos: MM = Minutos de Tolerancia, HH = Horas Laborables' + '\n Fecha: ' + fecha + ' Hora: ' + time,
                  alignment: 'left', color: 'blue', opacity: 0.5
                }]
              },
              {
                text: [{
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', color: 'blue', opacity: 0.5
                }],
              }
            ], fontSize: 9, color: '#A4B8FF',
          }
        ]
      },

      // Títulos del archivo PDF y contenido general 
      content: [
        { image: this.logo, width: 150 },
        ...this.datosEmpleado.map(obj => {
          if (obj.id === id_seleccionado) {
            return [
              { text: obj.empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, 0, 0, 20] },
              { text: 'REPORTE DE ATRASOS', fontSize: 17, alignment: 'center', margin: [0, 0, 0, 20] },
            ];
          }
        }),
        this.presentarDatosGenerales(id_seleccionado, form, confirmado),
        this.presentarAtrasos(confirmado),
      ],

      // Estilos del archivo PDF
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableD: { fontSize: 9, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTableP: { fontSize: 9, alignment: 'left', bold: true, margin: [50, 5, 5, 5] },
        tableHeaderA: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, margin: [20, 0, 20, 0], },
        tableHeaderS: { fontSize: 9, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTableC: { fontSize: 9, alignment: 'center', margin: [50, 5, 5, 5] },
        itemsTableF: { fontSize: 9, alignment: 'center' },
      }
    };
  }

  // Datos generales del PDF y sumatoria total de calculos realizados
  presentarDatosGenerales(id_seleccionado, form, confirmado) {
    // Inicialización de varibles
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo;
    var tiempoTotal: string, horaF: string, minF: string, secondF: string;
    var minTDecimal, horaTDecimal, minTDecimalH, horaTDecimalH, diasDecimal, trabaja;
    var day, hora1, hora2, formatoHorasDecimal: number = 0, formatoDiasDecimal: number = 0;
    var tHoras = 0, tMinutos = 0, tSegudos = 0, formatoHorasEntero, minutosEscrito;
    var t1 = new Date();
    var t2 = new Date();
    // Búsqueda de los datos del empleado del cual se obtiene el reporte
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
    });
    this.totalAtrasos.forEach(obj => {
      day = moment(obj.fec_hora_timbre).day();
      hora1 = (moment(obj.fec_hora_timbre).format('HH:mm:ss')).split(":");

      // Control de configuración de cálculos
      if (confirmado === true) {
        hora2 = (obj.hora_total).split(":");
      }
      else {
        hora2 = (obj.hora).split(":");
      }

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

      // Realización de cálculos
      minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
      horaTDecimal = (minTDecimal / 60) + t1.getHours();
      console.log('hora decimal', horaTDecimal);
      formatoHorasDecimal = formatoHorasDecimal + parseFloat(horaTDecimal.toFixed(3));
      console.log('total hora decimal', formatoHorasDecimal);
      formatoHorasEntero = parseFloat('0.' + String(formatoHorasDecimal).split('.')[1]) * 60

      // Control de escritura de minutos
      if (formatoHorasEntero.toFixed(0) < 10) {
        minutosEscrito = '0' + formatoHorasEntero.toFixed(0);
      }
      else {
        minutosEscrito = formatoHorasEntero.toFixed(0);
      }

      // Obtención de días de las horas de trabajo del empleado
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
      formatoDiasDecimal = formatoDiasDecimal + parseFloat(diasDecimal.toFixed(3));
      console.log('total dias decimal', formatoDiasDecimal);
    });
    var diaI = moment(form.inicioForm).day();
    var diaF = moment(form.finalForm).day();

    // Estructura de la tabla de lista de registros
    return {
      table: {
        widths: ['*'],
        body: [
          [{ text: 'INFORMACIÓN GENERAL EMPLEADO', style: 'tableHeader' },],
          [{
            columns: [
              { text: [{ text: 'CIUDAD: ' + ciudad, style: 'itemsTableI' }] },
              { text: [{ text: 'PERIODO DEL: ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableP' }] },
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'APELLIDOS: ' + apellido, style: 'itemsTableI' }] },
              { text: [{ text: 'NOMBRES: ' + nombre, style: 'itemsTableI' }] },
              { text: [{ text: 'CÉDULA: ' + cedula, style: 'itemsTableI' }] },
              { text: [{ text: 'CÓDIGO: ' + codigo, style: 'itemsTableI' }] }
            ]
          }],
          [{
            columns: [
              { text: [{ text: 'SUCURSAL: ' + sucursal, style: 'itemsTableI' }] },
              { text: [{ text: 'DEPARTAMENTO: ' + departamento, style: 'itemsTableI' }] },
              { text: [{ text: 'CARGO: ' + cargo, style: 'itemsTableI' }] },
              { text: [{ text: 'N° REGISTROS: ' + this.totalAtrasos.length, style: 'itemsTableI' }] },
            ]
          }],
          [{
            border: [false, false, false, false],
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: 'SUMATORIA TOTAL DE ATRASOS EN DIAS Y HORAS FORMATO DECIMAL', style: 'tableHeaderS' },
                  { text: 'SUMATORIA TOTAL DE ATRASOS EN DIAS Y HORAS FORMATO GENERAL', style: 'tableHeaderS' },
                ],
                [
                  { text: 'TOTAL DE ATRASOS EN DIAS LABORABLES DECIMAL: ' + formatoDiasDecimal.toFixed(3), style: 'itemsTableF' },
                  { rowSpan: 2, text: 'TOTAL DE ATRASOS EN HORAS Y MINUTOS: ' + String(formatoHorasDecimal).split('.')[0] + ' horas : ' + minutosEscrito + ' minutos', style: 'itemsTableF', margin: [0, 20, 0, 20] }
                ],
                [
                  { text: 'TOTAL DE ATRASOS EN HORAS LABORABLES DECIMAL: ' + formatoHorasDecimal, style: 'itemsTableF' },

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
          [{ text: 'LISTA DE ATRASOS PERIODO DEL ' + moment.weekdays(diaI).toUpperCase() + ' ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + moment.weekdays(diaF).toUpperCase() + ' ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'tableHeader' },],
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
  contarRegistros: number = 0;
  presentarAtrasos(confirmado: boolean) {
    this.contarRegistros = 0;
    return {
      table: {
        widths: ['auto', '*', 'auto', 'auto', '*', 'auto', '*', '*', 'auto', 'auto'],
        body: [
          [
            { text: 'N° REGISTRO', style: 'tableHeader' },
            { text: 'DÍA', style: 'tableHeader' },
            { text: 'FECHA', style: 'tableHeader' },
            { text: 'HORARIO', style: 'tableHeader' },
            { text: 'MM. TOLERANCIA', style: 'tableHeader' },
            { text: 'HORA TIMBRE', style: 'tableHeader' },
            { text: 'HH. TRABAJO', style: 'tableHeader' },
            { text: 'ATRASO', style: 'tableHeader' },
            { text: 'HORAS', style: 'tableHeader' },
            { text: 'DÍAS', style: 'tableHeader' },
          ],
          ...this.totalAtrasos.map(obj => {
            // Inicialización de variables
            var tiempoTotal: string, horaF: string, minF: string, secondF: string;
            var minTDecimal, horaTDecimal, minTDecimalH, horaTDecimalH, diasDecimal, trabaja;
            var day = moment(obj.fec_hora_timbre).day();
            var hora1 = (moment(obj.fec_hora_timbre).format('HH:mm:ss')).split(":");

            // Control de configuración de cálculos
            if (confirmado === true) {
              var hora2 = (obj.hora_total).split(":");
            }
            else {
              var hora2 = (obj.hora).split(":");
            }

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

            // Realización de cálculos
            minTDecimal = (t1.getSeconds() * 60) + t1.getMinutes();
            horaTDecimal = (minTDecimal / 60) + t1.getHours();

            // Obtención de días de trabajo del empleado
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
            this.contarRegistros = this.contarRegistros + 1;

            return [
              { text: this.contarRegistros, style: 'itemsTableD' },
              { text: moment.weekdays(day).charAt(0).toUpperCase() + moment.weekdays(day).slice(1), style: 'itemsTableD' },
              { text: moment(obj.fec_hora_timbre).format('DD/MM/YYYY'), style: 'itemsTableD' },
              { text: obj.hora, style: 'itemsTableD' },
              { text: obj.minu_espera + ' min', style: 'itemsTableD' },
              { text: moment(obj.fec_hora_timbre).format('HH:mm:ss'), style: 'itemsTableD' },
              { text: obj.horario_horas, style: 'itemsTableD' },
              { text: tiempoTotal, style: 'itemsTableD', fillColor: '#CCD1D1' },
              { text: horaTDecimal.toFixed(3), style: 'itemsTableD' },
              { text: diasDecimal.toFixed(3), style: 'itemsTableD' },
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
