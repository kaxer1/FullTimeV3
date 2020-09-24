import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorasExtrasRealesService } from 'src/app/servicios/reportes/horasExtrasReales/horas-extras-reales.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';
import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';

@Component({
  selector: 'app-reporte-entrada-salida',
  templateUrl: './reporte-entrada-salida.component.html',
  styleUrls: ['./reporte-entrada-salida.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class ReporteEntradaSalidaComponent implements OnInit {

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
    public restF: FeriadosService,
    public restEmpre: EmpresaService,
    public restHorario: EmpleadoHorariosService,
    public restPlan: PlanHorarioService,
    public router: Router,
    private toastr: ToastrService,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleadoLogueado(this.idEmpleado);
    this.VerDatosEmpleado();
    this.ObtenerFeriados();
    this.ObtenerLogo();
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

  // Evento para menejar el uso de paginación
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Obtener feriados registrados en el sistema
  feriados: any = [];
  ObtenerFeriados() {
    this.feriados = [];
    this.restF.ConsultarFeriado().subscribe(data => {
      this.feriados = data;
    });
  }

  // Obtener lista de empleados con contrato y cargo
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

  // Método para controlar ingreso de periodo de fechas 
  fechasPeriodo: any = [];
  inicioDate: any;
  finDate: any
  VerEntradasSalidasEmpleado(id_seleccionado, form, archivo) {
    if (form.inicioForm === '' || form.finalForm === '') {
      this.toastr.info('Ingresar fechas de periodo de búsqueda.', 'VERIFICAR DATOS DE FECHA')
    }
    else {
      if (Date.parse(form.inicioForm) <= Date.parse(form.finalForm)) {
        let fechas = {
          fechaInicio: form.inicioForm,
          fechaFinal: form.finalForm
        }
        this.fechasPeriodo = []; // Array que contiene todas las fechas del mes indicado 
        this.inicioDate = moment(form.inicioForm).format('MM-DD-YYYY');
        this.finDate = moment(form.finalForm).format('MM-DD-YYYY');

        // Inicializar datos de fecha
        var start = new Date(this.inicioDate);
        var end = new Date(this.finDate);

        // Lógica para obtener el nombre de cada uno de los día del periodo indicado
        while (start <= end) {
          this.fechasPeriodo.push(moment(start).format('dddd DD/MM/YYYY'));
          var newDate = start.setDate(start.getDate() + 1);
          start = new Date(newDate);
        }

        this.VerEntradasSalidasHorario(id_seleccionado, fechas, archivo, form, this.fechasPeriodo);
      }
      else {
        this.toastr.info('La fecha de inicio de Periodo no puede ser posterior a la fecha de fin de Periodo.', 'VERIFICAR');
      }
    }
  }

  // Método para obtener timbres de entradas y salidas del empleado de acuerdo al horario
  entradaSalidaHorario: any = [];
  entradaSalidaPlanificacion: any = [];
  totalEntradasSalidas: any = [];
  VerEntradasSalidasHorario(id_seleccionado, datosFecha, archivo, form, fechasTotales) {
    this.entradaSalidaHorario = [];
    this.entradaSalidaPlanificacion = [];
    this.totalEntradasSalidas = [];
    this.restR.ObtenerEntradaSalidaHorario(id_seleccionado, datosFecha).subscribe(dataH => {
      this.entradaSalidaHorario = dataH;
      this.VerEntradasSalidasPlanificacion(this.entradaSalidaHorario, id_seleccionado, archivo, datosFecha, form, fechasTotales);
    }, error => {
      this.VerEntradasSalidasPlanificacion(this.entradaSalidaHorario, id_seleccionado, archivo, datosFecha, form, fechasTotales);
    });
  }

  // Método para obtener timbres de entradas y salidas del empleado de acuerdo a la planificación
  VerEntradasSalidasPlanificacion(entradas_salida_horario: any, id_seleccionado: number, archivo: string, datos_fechas, form, fechasTotales: any) {
    this.restR.ObtenerEntradaSalidaPlanificacion(id_seleccionado, datos_fechas).subscribe(dataP => {
      this.entradaSalidaPlanificacion = dataP;
      if (entradas_salida_horario.length != 0) {
        entradas_salida_horario = entradas_salida_horario.concat(this.entradaSalidaPlanificacion);
        this.totalEntradasSalidas = entradas_salida_horario;
      }
      else {
        this.totalEntradasSalidas = this.entradaSalidaPlanificacion;
      }
      // this.totalAtrasos = this.totalAtrasos.sort((a, b) => new Date(a.fec_hora_timbre) > new Date(b.fec_hora_timbre));

      this.GenerarArchivos(id_seleccionado, archivo, form, fechasTotales);
      this.LimpiarFechas();
      this.LimpiarCampos();
    }, error => {
      if (entradas_salida_horario.length != 0) {
        this.totalEntradasSalidas = entradas_salida_horario;
        // console.log('prueba2', this.totalEntradasSalidas);
        //  this.totalAtrasos = this.totalAtrasos.sort((a, b) => new Date(a.fec_hora_timbre) > new Date(b.fec_hora_timbre));
        this.GenerarArchivos(id_seleccionado, archivo, form, fechasTotales);
        this.LimpiarFechas();
        this.LimpiarCampos();
      }
      else {
        this.toastr.info('El empleado no tiene registros de Atrasos.')
      }
    })
  }

  // Generación de reportes en formatos PDF - EXCEL
  empleadoHorario: any = [];
  empleadoPlan: any = [];
  GenerarArchivos(id_seleccionado: number, archivo: string, form, fechasTotales: any) {
    let fechas = {
      fechaInicio: form.inicioForm,
      fechaFinal: form.finalForm
    }
    this.empleadoHorario = [];
    this.empleadoPlan = [];

    // Búsqueda de la lista de los horarios del empleado
    this.restHorario.ObtenerHorariosFechasEmpleado(id_seleccionado, fechas).subscribe(data => {
      this.empleadoHorario = data;
      console.log('horario', this.empleadoHorario);
      // Búsqueda de la lista de las planificaciones del empleado
      this.restPlan.ObtenerPlanHorarioEmpleadoFechas(id_seleccionado, fechas).subscribe(dataP => {
        this.empleadoPlan = dataP;
        console.log('plan', this.empleadoPlan);
        // Llamado a ver archivos
        this.VerArchivos(id_seleccionado, archivo, form, fechasTotales, this.totalEntradasSalidas);

      }, error => {
        // Llamado a ver archivos cuando no existe horarios de planificación del empleado
        this.VerArchivos(id_seleccionado, archivo, form, fechasTotales, this.totalEntradasSalidas);
      })

    }, error => {
      // Búsqueda de la lista de las planificaciones del empleado
      this.restPlan.ObtenerPlanHorarioEmpleadoFechas(id_seleccionado, fechas).subscribe(dataP => {
        this.empleadoPlan = dataP;
        console.log('plan', this.empleadoPlan);
        // Llamado a ver archivos
        this.VerArchivos(id_seleccionado, archivo, form, fechasTotales, this.totalEntradasSalidas);

      }, error => {
        // Llamado a ver archivos cuando no existe horarios de planifiación del empleado
        this.VerArchivos(id_seleccionado, archivo, form, fechasTotales, this.totalEntradasSalidas);
      })
    })
  }

  VerArchivos(id_seleccionado, archivo, form, fechasTotales, entradasSalidas) {
    if (archivo === 'pdf') {
      this.generarPdf('open', id_seleccionado, form, fechasTotales);
    }
    else if (archivo === 'excel') {
      this.exportToExcel(entradasSalidas);
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

  generarPdf(action = 'open', id_seleccionado, form, fechasTotales: any) {
    const documentDefinition = this.getDocumentDefinicion(id_seleccionado, form, fechasTotales);

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  getDocumentDefinicion(id_seleccionado: number, form, fechasTotales: any) {

    sessionStorage.setItem('Administrador', this.empleadoLogueado);

    return {
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
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
        // Formato de hora actual
        if (f.getMinutes() < 10) {
          var time = f.getHours() + ':0' + f.getMinutes();
        }
        else {
          var time = f.getHours() + ':' + f.getMinutes();
        }

        return {
          margin: 10,
          columns: [
            {
              text: [{
                text: 'Glosario de Terminos: ALM = Almuerzo ' + '\n Fecha: ' + fecha + ' Hora: ' + time,
                alignment: 'left', color: 'blue', opacity: 0.5
              }]
            },
            { text: [{ text: '© Pag ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', color: 'blue', opacity: 0.5 }], }
          ], fontSize: 10, color: '#A4B8FF',
        }
      },

      // Título e imagen del archivo PDF - Contenido del archivo
      content: [
        { image: this.logo, width: 150 },
        ...this.datosEmpleado.map(obj => {
          if (obj.id === id_seleccionado) {
            return [
              {
                text: obj.empresa.toUpperCase(),
                bold: true, fontSize: 25, alignment: 'center', margin: [0, 0, 0, 15]
              },
              {
                text: 'REPORTE ENTRADAS - SALIDAS',
                fontSize: 17, alignment: 'center', margin: [0, 0, 0, 20]
              },
            ];
          }
        }),
        this.presentarDatosGenerales(id_seleccionado, form, fechasTotales),
        this.presentarEntradasSalidas(fechasTotales),
      ],

      // Estilos del archivo PDF 
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: '#6495ED' },
        itemsTableD: { fontSize: 8, alignment: 'center' },
        itemsTableI: { fontSize: 9, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTableP: { fontSize: 9, alignment: 'left', bold: true, margin: [50, 5, 5, 5] },
        tableHeaderESC: { fontSize: 9, bold: true, alignment: 'center', fillColor: '#00FF00' },
        tableHeaderES: { fontSize: 9, bold: true, alignment: 'center', fillColor: '#6495ED' },
        centrado: { fontSize: 9, bold: true, alignment: 'center', fillColor: '#6495ED', margin: [0, 10, 0, 10] },
      }
    };
  }

  // Estructura de los datos generales del empleado
  presentarDatosGenerales(id_seleccionado, form, fechasTotales) {
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo;
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
              { text: [{ text: 'N° REGISTROS: ' + fechasTotales.length, style: 'itemsTableI' }] },
            ]
          }],
          [{ text: 'LISTA DE ENTRADAS - SALIDAS PERIODO DEL ' + moment.weekdays(diaI).toUpperCase() + ' ' + String(moment(form.inicioForm, "YYYY/MM/DD").format("DD/MM/YYYY")) + ' AL ' + moment.weekdays(diaF).toUpperCase() + ' ' + String(moment(form.finalForm, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'tableHeader' },],
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

  IterarFeriados(day, dayFecha): any {
    var estado = '';
    var fechaPlan;

    // Buscar dias en la lista de planificacion del empleado
    if (this.empleadoPlan.length != 0) {
      for (var k = 0; k <= this.empleadoPlan.length - 1; k++) {
        fechaPlan = moment(this.empleadoPlan[k].fecha_dia).format('DD/MM/YYYY');
        if (dayFecha === fechaPlan) {
          if (this.empleadoPlan[k].tipo_dia === 1) {
            estado = 'Libre';
          }
          else if (this.empleadoPlan[k].tipo_dia === 2) {
            estado = 'Feriado';
          }
          break;
        }
        else {
          // Buscar días en la lista del horario del empleado
          if (this.empleadoHorario.length != 0) {
            for (var j = 0; j <= this.empleadoHorario.length - 1; j++) {
              if (day === 'Lunes' && this.empleadoHorario[j].lunes === true) {
                estado = 'Libre';
                break;
              }
              else if (day === 'Martes' && this.empleadoHorario[j].martes === true) {
                estado = 'Libre';
                break;
              }
              else if (day === 'Miercoles' && this.empleadoHorario[j].miercoles === true) {
                estado = 'Libre';
                break;
              }
              else if (day === 'Jueves' && this.empleadoHorario[j].jueves === true) {
                estado = 'Libre';
                break;
              }
              else if (day === 'Viernes' && this.empleadoHorario[j].viernes === true) {
                estado = 'Libre';
                break;
              }
              else if (day === 'Sabado' && this.empleadoHorario[j].sabado === true) {
                estado = 'Libre';
                break;
              }
              else if (day === 'Domingo' && this.empleadoHorario[j].domingo === true) {
                estado = 'Libre';
                break;
              }
            }
          }
        }
      }
      return estado;
    }
    else {
      // Buscar días en la lista del horario del empleado
      if (this.empleadoHorario.length != 0) {
        for (var j = 0; j <= this.empleadoHorario.length - 1; j++) {
          if (day === 'Lunes' && this.empleadoHorario[j].lunes === true) {
            estado = 'Libre';
            break;
          }
          else if (day === 'Martes' && this.empleadoHorario[j].martes === true) {
            estado = 'Libre';
            break;
          }
          else if (day === 'Miercoles' && this.empleadoHorario[j].miercoles === true) {
            estado = 'Libre';
            break;
          }
          else if (day === 'Jueves' && this.empleadoHorario[j].jueves === true) {
            estado = 'Libre';
            break;
          }
          else if (day === 'Viernes' && this.empleadoHorario[j].viernes === true) {
            estado = 'Libre';
            break;
          }
          else if (day === 'Sabado' && this.empleadoHorario[j].sabado === true) {
            estado = 'Libre';
            break;
          }
          else if (day === 'Domingo' && this.empleadoHorario[j].domingo === true) {
            estado = 'Libre';
            break;
          }
        }
        return estado;
      }
    }
  }

  contadorRegistros: number = 0;
  // Lista de registros de entradas y salidas
  presentarEntradasSalidas(fechasTotales: any) {
    this.contadorRegistros = 0;
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*', '*', 'auto', '*', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { rowSpan: 2, text: 'N° REGISTROS', style: 'centrado' },
            { rowSpan: 2, text: 'DÍA', style: 'centrado' },
            { rowSpan: 2, text: 'FECHA', style: 'centrado' },
            { colSpan: 2, text: 'ENTRADA', style: 'tableHeaderES' },
            '',
            { rowSpan: 2, text: 'ESTADO', style: 'centrado' },
            { colSpan: 2, text: 'SALIDA ALM.', style: 'tableHeaderES' },
            '',
            { rowSpan: 2, text: 'ESTADO', style: 'centrado' },
            { colSpan: 2, text: 'ENTRADA ALM.', style: 'tableHeaderES' },
            '',
            { rowSpan: 2, text: 'ESTADO', style: 'centrado' },
            { colSpan: 2, text: 'SALIDA', style: 'tableHeaderES' },
            '',
            { rowSpan: 2, text: 'ESTADO', style: 'centrado' },
          ],
          [
            '', '', '',
            { text: 'HORARIO', style: 'tableHeaderES' },
            { text: 'TIMBRE', style: 'tableHeaderESC' },
            '',
            { text: 'HORARIO', style: 'tableHeaderES' },
            { text: 'TIMBRE', style: 'tableHeaderESC' },
            '',
            { text: 'HORARIO', style: 'tableHeaderES' },
            { text: 'TIMBRE', style: 'tableHeaderESC' },
            '',
            { text: 'HORARIO', style: 'tableHeaderES' },
            { text: 'TIMBRE', style: 'tableHeaderESC' },
            '',
          ],
          ...fechasTotales.map(obj => {
            // Inicialización de variables
            var fecha_timbre, fechaFeriado, dayFecha, day;
            var entrada = '', salida = '', almuerzoS = '', almuerzoE = '', sinTimbre = '';
            var horarioE = '-', horarioS = '-', horarioAE = '-', horarioAS = '-';
            var timbreE = '-', timbreS = '-', timbreAlmuerzoE = '-', timbreAlmuerzoS = '-';
            dayFecha = obj.split(' ')[1];
            day = obj.split(' ')[0].charAt(0).toUpperCase() + obj.split(' ')[0].slice(1);

            // Búsqueda de los datos
            this.totalEntradasSalidas.forEach(element => {
              fecha_timbre = moment(element.fec_hora_timbre).format('DD/MM/YYYY');
              // TIMBRE EXISTENTE - ESTADO Y HORA DEL TIMBRE
              if (dayFecha === fecha_timbre && element.accion === 'E') {
                entrada = 'REGISTRADO'
                horarioE = element.hora;
                timbreE = moment(element.fec_hora_timbre).format('HH:mm:ss')
              }
              else if (dayFecha === fecha_timbre && element.accion === 'S') {
                salida = 'REGISTRADO'
                horarioS = element.hora;
                timbreS = moment(element.fec_hora_timbre).format('HH:mm:ss')
              }
              else if (dayFecha === fecha_timbre && element.accion === 'S/A') {
                almuerzoS = 'REGISTRADO'
                horarioAS = element.hora;
                timbreAlmuerzoS = moment(element.fec_hora_timbre).format('HH:mm:ss')
              }
              else if (dayFecha === fecha_timbre && element.accion === 'E/A') {
                almuerzoE = 'REGISTRADO'
                horarioAE = element.hora;
                timbreAlmuerzoE = moment(element.fec_hora_timbre).format('HH:mm:ss')
              }
              // NO EXISTE TIMBRE
              else {
                if (this.feriados.length != 0) {
                  // Buscar días en la lista de feriados
                  for (var i = 0; i <= this.feriados.length - 1; i++) {
                    fechaFeriado = moment(this.feriados[i].fecha).format('DD/MM/YYYY');
                    if (dayFecha === fechaFeriado) {
                      sinTimbre = 'Feriado';
                      break;
                    }
                    else {
                      sinTimbre = this.IterarFeriados(day, dayFecha);
                    }
                  }
                }
                else {
                  sinTimbre = this.IterarFeriados(day, dayFecha);
                }
              }
            });

            // Control de estados SIN TIMBRE
            if (entrada === '' && sinTimbre === '') {
              entrada = 'Falta Timbre';
            }
            if (salida === '' && sinTimbre === '') {
              salida = 'Falta Timbre'
            }
            if (almuerzoE === '' && sinTimbre === '') {
              almuerzoE = 'Falta Timbre'
            }
            if (almuerzoS === '' && sinTimbre === '') {
              almuerzoS = 'Falta Timbre'
            }

            // Control de estados FERIADOS
            if (entrada === '' && sinTimbre === 'Feriado') {
              entrada = 'FERIADO';
            }
            if (salida === '' && sinTimbre === 'Feriado') {
              salida = 'FERIADO'
            }
            if (almuerzoE === '' && sinTimbre === 'Feriado') {
              almuerzoE = 'FERIADO'
            }
            if (almuerzoS === '' && sinTimbre === 'Feriado') {
              almuerzoS = 'FERIADO'
            }

            // Control de estados LIBRES
            if (entrada === '' && sinTimbre === 'Libre') {
              entrada = 'LIBRE';
            }
            if (salida === '' && sinTimbre === 'Libre') {
              salida = 'LIBRE'
            }
            if (almuerzoE === '' && sinTimbre === 'Libre') {
              almuerzoE = 'LIBRE'
            }
            if (almuerzoS === '' && sinTimbre === 'Libre') {
              almuerzoS = 'LIBRE'
            }

            // Conteo de registros
            this.contadorRegistros = this.contadorRegistros + 1;

            return [
              { text: this.contadorRegistros, style: 'itemsTableD' },
              { text: obj.split(' ')[0].charAt(0).toUpperCase() + obj.split(' ')[0].slice(1), style: 'itemsTableD' },
              { text: obj.split(' ')[1], style: 'itemsTableD' },
              { text: horarioE, style: 'itemsTableD' },
              { text: timbreE, style: 'itemsTableD' },
              { text: entrada, style: 'itemsTableD' },
              { text: horarioAS, style: 'itemsTableD' },
              { text: timbreAlmuerzoS, style: 'itemsTableD' },
              { text: almuerzoS, style: 'itemsTableD' },
              { text: horarioAE, style: 'itemsTableD' },
              { text: timbreAlmuerzoE, style: 'itemsTableD' },
              { text: almuerzoE, style: 'itemsTableD' },
              { text: horarioS, style: 'itemsTableD' },
              { text: timbreS, style: 'itemsTableD' },
              { text: salida, style: 'itemsTableD' },
            ];
          })
        ]
      },
      // Estilo de colores formato zebra
      layout: {
        fillColor: function (i, node) {
          return (i % 2 === 0) ? '#CCD1D1' : null;
        }
      },
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
