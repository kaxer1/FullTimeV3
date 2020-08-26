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
    var h = '02:15';

    //console.log('numero', h1)
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

  datosAutorizacion: any = [];
  permisosHorarios: any = [];
  permisosPlanificacion: any = [];
  totalPermisos: any = [];
  VerPermisosEmpleado(id_seleccionado, archivo) {
    this.permisosHorarios = [];
    this.permisosPlanificacion = [];
    this.totalPermisos = [];
    this.restR.ObtenerPermisosHorarios(id_seleccionado).subscribe(dataH => {
      this.permisosHorarios = dataH;
      this.VerPermisosPlanificacion(this.permisosHorarios, id_seleccionado, archivo);
    }, error => {
      this.VerPermisosPlanificacion(this.permisosHorarios, id_seleccionado, archivo);
    });
  }

  VerPermisosPlanificacion(permisos_horario: any, id_seleccionado: number, archivo: string) {
    this.restR.ObtenerPermisosPlanificacion(id_seleccionado).subscribe(dataP => {
      this.permisosPlanificacion = dataP;
      if (permisos_horario.length != 0) {
        permisos_horario = permisos_horario.concat(this.permisosPlanificacion);
        this.totalPermisos = permisos_horario;
        console.log('prueba', this.totalPermisos);
      }
      else {
        this.totalPermisos = this.permisosPlanificacion;
        console.log('prueba1', this.totalPermisos);
      }
      this.VerDatosAutorizacion(id_seleccionado, archivo);
    }, error => {
      if (permisos_horario.length != 0) {
        this.totalPermisos = permisos_horario;
        console.log('prueba2', this.totalPermisos);
        this.VerDatosAutorizacion(id_seleccionado, archivo);
      }
      else {
        this.toastr.info('El empleado no tiene registros de PERMISOS.')
      }
    })
  }

  VerDatosAutorizacion(id_seleccionado: number, archivo: string) {
    this.datosAutorizacion = [];
    this.restR.ObtenerAutorizacionPermiso(id_seleccionado).subscribe(dataA => {
      this.datosAutorizacion = dataA;
      for (var i = 0; i <= this.datosAutorizacion.length - 1; i++) {
        if (this.datosAutorizacion[i].estado === 1) {
          this.datosAutorizacion[i].estado = 'Pendiente';
        }
        else if (this.datosAutorizacion[i].estado === 2) {
          this.datosAutorizacion[i].estado = 'Pre-autorizado';
        }
        else if (this.datosAutorizacion[i].estado === 3) {
          this.datosAutorizacion[i].estado = 'Autorizado';
        }
        else if (this.datosAutorizacion[i].estado === 4) {
          this.datosAutorizacion[i].estado = 'Negado';
        }
      }
      if (archivo === 'pdf') {
        console.log('archivo', archivo)
        this.generarPdf('open', id_seleccionado);
      }
      else if (archivo === 'excel') {
        this.exportToExcel(this.permisosHorarios);
      }
    })
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

  ObtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
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
                text: 'REPORTE PERMISOS',
                fontSize: 17,
                alignment: 'center',
                margin: [0, 0, 0, 20]
              },
            ];
          }
        }),
        this.presentarDatosGenerales(id_seleccionado),
        this.presentarPermisos(),
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
        itemsTableC: {
          fontSize: 9,
          alignment: 'center',
          margin: [50, 5, 5, 5]
        },
        tableHeaderA: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED',
          margin: [20, 0, 20, 0],
        },
      }
    };
  }

  presentarDatosGenerales(id_seleccionado) {
    var ciudad, nombre, apellido, cedula, codigo, sucursal, departamento, cargo, totalDias = 0, totalHoras = 0, enteroHoras = 0, formatoHoras, formatoHorasTotales;
    var estado, horas_decimal, dias_decimal, horas_horario, empleadoAutoriza, dias_decimal1, tDias, horas_horario1, horaT;
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
    this.totalPermisos.forEach(obj => {
      this.datosAutorizacion.forEach(element => {
        if (obj.id === element.id_permiso) {
          estado = element.estado;
          empleadoAutoriza = this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido
          if (estado === 'Autorizado') {
            horas_decimal = (parseInt(obj.hora_numero.split(':')[0]) + parseFloat(obj.hora_numero.split(':')[1]) / 60).toFixed(2);
            //console.log('horas decimal', horas_decimal);
            if (obj.horario_horas.split(':')[1] != undefined) {
              horas_horario = (parseInt(obj.horario_horas.split(':')[0]) + parseFloat(obj.horario_horas.split(':')[1]) / 60).toFixed(2);
              // console.log('horas horario', horas_horario);
              dias_decimal = parseFloat((horas_decimal / horas_horario).toFixed(2)) + obj.dia;
              //console.log('dias decimal', dias_decimal);
              dias_decimal1 = (horas_decimal / horas_horario) + obj.dia;
              // console.log('dias decimal1', dias_decimal1);
              horaT = parseFloat(horas_decimal) + (obj.dia * horas_horario);
              totalDias = totalDias + parseFloat(dias_decimal);
              //console.log('total dias', totalDias);
              horas_horario1 = parseInt(obj.horario_horas.split(':')[0]) + parseFloat(obj.horario_horas.split(':')[1]) / 60;
              totalHoras = totalHoras + horaT;
              //console.log('total horas', totalHoras);
              //console.log('horario 1', horas_horario1);
              enteroHoras = enteroHoras + parseFloat(horas_decimal);
              //console.log('total enteros', enteroHoras);
            }
            else {
              dias_decimal = (parseFloat(horas_decimal) / parseInt(obj.horario_horas)) + obj.dia;
              dias_decimal1 = (parseFloat((horas_decimal / parseFloat(obj.horario_horas)).toFixed(2)) + obj.dia).toFixed(2);
              // console.log('dias decimal', dias_decimal);
              totalDias = totalDias + parseFloat(dias_decimal1);
              //console.log('total dias', totalDias);
              totalHoras = totalHoras + (dias_decimal * parseInt(obj.horario_horas));
              // console.log('total horas', totalHoras);
              enteroHoras = enteroHoras + parseFloat(horas_decimal);
              //console.log('total horas enteros', enteroHoras);
            }
          }
        }
        else {
          estado = obj.estado
        }
      });
    })
    if (5 < parseInt(String(enteroHoras).split('.')[0])) {
      tDias = totalDias - 1;
    }
    else {
      tDias = totalDias;
    }
    if (parseInt(String(enteroHoras).split('.')[0]) < 10) {
      // console.log('entra 1')
      if (parseInt(String(parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).split('.')[0]) === 0) {
        //console.log('entra 1.1')
        formatoHoras = '0' + String(enteroHoras).split('.')[0] + ':' + String((parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0] + '0';
      }
      else if (parseInt(String(parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).split('.')[0]) < 10) {
        //console.log('entra 1.2')
        formatoHoras = '0' + String(enteroHoras).split('.')[0] + ':0' + String((parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0];
      }
      else {
        //console.log('entra 1.3')
        formatoHoras = '0' + String(enteroHoras).split('.')[0] + ':' + String((parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0];
        //console.log('p', parseFloat('0.' + String(enteroHoras).split('.')[1]))
      }
    }
    else {
      if (parseInt(String(parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).split('.')[0]) === 0) {
        // console.log('entra 2.1')
        formatoHoras = String(enteroHoras).split('.')[0] + ':' + String(parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).split('.')[0] + '0';
      }
      else if (parseInt(String(parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).split('.')[0]) < 10) {
        // console.log('entra 2.2')
        formatoHoras = String(enteroHoras).split('.')[0] + ':0' + String(parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).split('.')[0];
      }
      else {
        // console.log('entra 2.3')
        formatoHoras = String(enteroHoras).split('.')[0] + ':' + String((parseFloat('0.' + String(enteroHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0];
      }
    }
    if (parseInt(String(totalHoras).split('.')[0]) < 10) {
      // console.log('entra 1')
      if (parseInt(String(parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).split('.')[0]) === 0) {
        // console.log('entra 1.1')
        formatoHorasTotales = '0' + String(totalHoras).split('.')[0] + ':' + String((parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0] + '0';
      }
      else if (parseInt(String(parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).split('.')[0]) < 10) {
        // console.log('entra 1.2')
        formatoHorasTotales = '0' + String(totalHoras).split('.')[0] + ':0' + String((parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0];
      }
      else {
        // console.log('entra 1.3')
        formatoHorasTotales = '0' + String(totalHoras).split('.')[0] + ':' + String((parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0];
        console.log('p', parseFloat('0.' + String(totalHoras).split('.')[1]))
      }
    }
    else {
      if (parseInt(String(parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).split('.')[0]) === 0) {
        // console.log('entra 2.1')
        formatoHorasTotales = String(totalHoras).split('.')[0] + ':' + String(parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).split('.')[0] + '0';
      }
      else if (parseInt(String(parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).split('.')[0]) < 10) {
        // console.log('entra 2.2')
        formatoHorasTotales = String(totalHoras).split('.')[0] + ':0' + String(parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).split('.')[0];
      }
      else {
        // console.log('entra 2.3')
        formatoHorasTotales = String(totalHoras).split('.')[0] + ':' + String((parseFloat('0.' + String(totalHoras).split('.')[1]) * 60).toFixed(0)).split('.')[0];

      }
    }
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
                      text: 'CÓDIGO: ' + codigo, style: 'itemsTableI'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'N° REGISTROS: ' + this.totalPermisos.length, style: 'itemsTableI'
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
                      text: 'CARGO: ' + cargo, style: 'itemsTableI'
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
                      text: 'TOTAL EN DIAS: ' + parseFloat(totalDias.toFixed(2)), style: 'itemsTableC'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'TOTAL EN HORAS: ' + totalHoras.toFixed(2), style: 'itemsTableC'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'PERMISO DÍAS: ' + String(tDias).split('.')[0] + ' dd' + '  HORAS: ' + formatoHoras + ' hh', style: 'itemsTableC'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'TOTAL HORAS: ' + String(totalHoras.toFixed(2)).split('.')[0] + ':' + formatoHorasTotales.split(':')[1], style: 'itemsTableC'
                    }
                  ]
                },
              ]
            }
          ],
          [
            { text: 'LISTA DE PERMISOS', style: 'tableHeader' },
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
  contadorN = 0;

  accionT: string;
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
            { text: 'H. TRABAJO', style: 'tableHeader' },
            { text: 'ESTADO', style: 'tableHeader' },
            { text: 'AUTORIZA', style: 'tableHeader' },
            { text: 'HORAS', style: 'tableHeader' },
            { text: 'DÍAS', style: 'tableHeader' },
          ],
          ...this.totalPermisos.map(obj => {
            //console.log('permisos', this.totalPermisos)
            let estado = '', horas_decimal, dias_decimal, horas_horario, horaT;
            let empleadoAutoriza;
            for (var i = 0; i <= this.datosAutorizacion.length - 1; i++) {
              if (obj.id === this.datosAutorizacion[i].id_permiso) {
                // console.log(this.datosAutorizacion[i].estado);
                estado = this.datosAutorizacion[i].estado;
                // console.log('entra if .---estado', estado);
                if (estado === 'Autorizado') {
                  empleadoAutoriza = this.empleadoLogueado[0].nombre + ' ' + this.empleadoLogueado[0].apellido;
                 horas_decimal = (parseFloat(obj.hora_numero.split(':')[0]) + parseFloat(obj.hora_numero.split(':')[1]) / 60).toFixed(2);
                  //  console.log('dato permiso: ', horas_decimal)
                  if (obj.horario_horas.split(':')[1] != undefined) {
                    horas_horario = (parseInt(obj.horario_horas.split(':')[0]) + parseFloat(obj.horario_horas.split(':')[1]) / 60).toFixed(2);
                    //  console.log('dato horario: ', horas_horario)
                    dias_decimal = (parseFloat((horas_decimal / horas_horario).toFixed(2)) + obj.dia).toFixed(2);
                    //horaT = horas_decimal + (obj.dia * horas_horario);
                    horaT = (parseFloat(horas_decimal) + (obj.dia * parseFloat(horas_horario))).toFixed(2);
                  }
                  else {
                    dias_decimal = (parseFloat((horas_decimal / parseFloat(obj.horario_horas)).toFixed(2)) + obj.dia).toFixed(2);
                    horaT = (parseFloat(horas_decimal) + (obj.dia * parseFloat(obj.horario_horas))).toFixed(2);
                  }

               /*   var tiempoTotal: string, horaF: string, minF: string, secondF: string;
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
                  diasDecimal = horaTDecimal / horaTDecimalH;*/


                }
                break
              } else {
                //  console.log(obj.estado);
                estado = obj.estado
              }
            }
            return [
              { text: obj.num_permiso, style: 'itemsTableD' },
              { text: String(moment(obj.fec_creacion, "YYYY/MM/DD").format("DD/MM/YYYY")), style: 'itemsTableD' },
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
