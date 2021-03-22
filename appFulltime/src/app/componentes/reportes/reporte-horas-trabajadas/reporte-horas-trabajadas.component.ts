import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { ITableEmpleados } from 'src/app/model/reportes.model';
import { ReportesAsistenciasService } from 'src/app/servicios/reportes/reportes-asistencias.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { IReporteHorasTrabaja } from 'src/app/model/reportes.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-reporte-horas-trabajadas',
  templateUrl: './reporte-horas-trabajadas.component.html',
  styleUrls: ['./reporte-horas-trabajadas.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class ReporteHorasTrabajadasComponent implements OnInit {

  fec_inicio_mes = new FormControl('', Validators.required);
  fec_final_mes = new FormControl('', Validators.required);
  
  public fechasForm = new FormGroup({
    fec_inicio: this.fec_inicio_mes,
    fec_final: this.fec_final_mes
  })
  
  respuesta: any [];
  sucursales: any = [];
  departamentos: any = [];
  empleados: any = [];
  bool_suc: boolean = false;
  bool_dep: boolean = false;
  bool_emp: boolean = false;
  data_pdf: any = [];

  selectionSuc = new SelectionModel<ITableEmpleados>(true, []);
  selectionDep = new SelectionModel<ITableEmpleados>(true, []);
  selectionEmp = new SelectionModel<ITableEmpleados>(true, []);
  
  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre_emp = new FormControl('', [Validators.minLength(2)]);
  nombre_dep = new FormControl('', [Validators.minLength(2)]);
  nombre_suc = new FormControl('', [Validators.minLength(2)]);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombreEmp: '';
  filtroNombreDep: '';
  filtroNombreSuc: '';
  
  constructor(
    private toastr: ToastrService,
    private R_asistencias: ReportesAsistenciasService,
    private restEmpre: EmpresaService
  ) { 
    this.ObtenerLogo();
    this.ObtenerColores();
  }

  ngOnInit(): void {
    sessionStorage.removeItem('reporte_horas_trab');
    this.R_asistencias.Departamentos().subscribe((res: any[]) => {
      sessionStorage.setItem('reporte_horas_trab', JSON.stringify(res))
      this.sucursales = res.map(obj => {
        return {
          id: obj.id_suc,
          nombre: obj.name_suc
        }
      });

      res.forEach(obj => {
        obj.departamentos.forEach(ele => {
          this.departamentos.push({
            id: ele.id_depa,
            nombre: ele.name_dep
          })
        })
      })

      res.forEach(obj => {
        obj.departamentos.forEach(ele => {
          ele.empleado.forEach(r => {
            this.empleados.push({
              id: r.id,
              nombre: r.name_empleado,
              codigo: r.codigo,
              cedula: r.cedula
            })
          })
        })
      })
      console.log('SUCURSALES',this.sucursales);
      console.log('DEPARTAMENTOS',this.departamentos);
      console.log('EMPLEADOS',this.empleados);
      
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  opcion: number;
  BuscarPorTipo(e: MatRadioChange) {
    this.opcion = parseInt(e.value);
    switch (e.value) {
      case '1':
        this.bool_suc = true; this.bool_dep = false; this.bool_emp = false;
      break;
      case '2':
        this.bool_suc = false; this.bool_dep = true; this.bool_emp = false;
      break;
      case '3':
        this.bool_suc = false; this.bool_dep = false; this.bool_emp = true;
      break;
      default:
        this.bool_suc = false; this.bool_dep = false; this.bool_emp = false;
        break;
    }
  }

  /**
   * Funciones para validar los campos y las fechas de rangos del reporte
   */

  f_inicio_req: string = '';
  f_final_req: string = '';
  habilitar: boolean = false;
  estilo: any = { 'visibility': 'hidden' };
  ValidarRangofechas(form) {
    var f_i = new Date(form.fec_inicio)
    var f_f = new Date(form.fec_final)

    if (f_i < f_f) {
      this.toastr.success('Fechas validas','', {
        timeOut: 6000,
      });
      this.f_inicio_req = f_i.toJSON().split('T')[0];
      this.f_final_req = f_f.toJSON().split('T')[0];
      this.habilitar = true;
      this.estilo = { 'visibility': 'visible' };
    } else if (f_i > f_f) {
      this.toastr.info('Fecha final es menor a la fecha inicial','', {
        timeOut: 6000,
      });
      this.fechasForm.reset();
    } else if (f_i.toLocaleDateString() === f_f.toLocaleDateString()) {
      this.toastr.info('Fecha inicial es igual a la fecha final','', {
        timeOut: 6000,
      });
      this.fechasForm.reset();
    }
  }

  /**
   * VALIDACIONES REPORT
   */
  validacionReporte(action) {

    if (this.f_inicio_req === '' || this.f_final_req === '') return this.toastr.error('Primero valide fechas de busqueda') 
    if (this.bool_suc === false && this.bool_dep === false && this.bool_emp === false) return this.toastr.error('Seleccione un criterio de búsqueda') 

    switch (this.opcion) {
      case 1:
        if (this.selectionSuc.selected.length === 0) return this.toastr.error('No a seleccionado ninguno', 'Seleccione sucursal')
        this.ModelarSucursal(action);
      break;
      case 2:
        if (this.selectionDep.selected.length === 0) return this.toastr.error('No a seleccionado ninguno', 'Seleccione departamentos')
        this.ModelarDepartamento(action);
      break;
      case 3:
        if (this.selectionEmp.selected.length === 0) return this.toastr.error('No a seleccionado ninguno', 'Seleccione empleados')
        this.ModelarEmpleados(action);
      break;
      default:
        this.bool_suc = false; this.bool_dep = false; this.bool_emp = false;
        break;
    }
  }

  ModelarSucursal(accion) {

    let respuesta = JSON.parse(sessionStorage.getItem('reporte_horas_trab'))

    let suc = respuesta.filter(o => {
      var bool =  this.selectionSuc.selected.find(obj1 => {
        return obj1.id === o.id_suc
      })
      return bool != undefined
    })

    console.log('SUCURSAL', suc);
    this.data_pdf = []
    this.R_asistencias.ReporteHorasTrabajadasMultiple(suc, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log(this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel(); break;
        default: this.generarPdf(accion); break;
      }
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  ModelarDepartamento(accion) {
    
    let respuesta = JSON.parse(sessionStorage.getItem('reporte_horas_trab'))

    respuesta.forEach((obj: any) => {
      obj.departamentos =  obj.departamentos.filter(o => {
        var bool =  this.selectionDep.selected.find(obj1 => {
          return obj1.id === o.id_depa
        })
        return bool != undefined
      })
    })
    let dep = respuesta.filter(obj => { 
      return obj.departamentos.length > 0
    });
    console.log('DEPARTAMENTOS', dep);
    this.data_pdf = []
    this.R_asistencias.ReporteHorasTrabajadasMultiple(dep, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log(this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel(); break;
        default: this.generarPdf(accion); break;
      }
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  ModelarEmpleados(accion) {

    let respuesta = JSON.parse(sessionStorage.getItem('reporte_horas_trab'))

    respuesta.forEach((obj: any) => {
      obj.departamentos.forEach(element => {
        element.empleado = element.empleado.filter(o => {
          var bool =  this.selectionEmp.selected.find(obj1 => {
            return obj1.id === o.id
          })
          return bool != undefined
        })
      });
    })
    respuesta.forEach(obj => { 
      obj.departamentos = obj.departamentos.filter(e => {
        return e.empleado.length > 0
      })
    });

    let emp = respuesta.filter(obj => { 
      return obj.departamentos.length > 0
    });
    
    console.log('EMPLEADOS', emp);
    this.data_pdf = []
    this.R_asistencias.ReporteHorasTrabajadasMultiple(emp, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log(this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel(); break;
        default: this.generarPdf(accion); break;
      }
    }, err => {
      this.toastr.error(err.error.message)
    })
  }


  /***************************
   * 
   * COLORES Y LOGO PARA EL REPORTE
   * 
   *****************************/

  logo: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logo = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  p_color: any;
  s_color: any;
  ObtenerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  /******************************************************
   * 
   *          PDF
   * 
   *******************************************/

  generarPdf(action) {
    const documentDefinition = this.getDocumentDefinicion();
    var f = new Date()
    let doc_name = "Reporte horas trabajadas" + f.toLocaleString() + ".pdf";
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(doc_name); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion() {
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [ 40, 60, 40, 40 ],
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + localStorage.getItem('fullname_print'), margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        h.setUTCHours(h.getHours());
        var time = h.toJSON().split("T")[1].split(".")[0];
        
        return [
          {
            table: {
              widths: ['auto','auto','auto','auto','auto','auto'],
              body: [
                [
                  { text: 'EoS: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Entrada o Salida.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'AES: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Entrada o Salida de almuerzo.', border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'PES: ', bold: true, border: [false, false, false, false], style: ['quote', 'small'] },
                  { text: 'Entrada o Salida de permisos.', border: [false, false, false, false], style: ['quote', 'small'] }
                ]
              ]
            }
          },
          {
            margin: 10,
            columns: [
              { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
              { text: [
                  {
                    text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                    alignment: 'right', opacity: 0.3
                  }
                ],
              }
            ],
            fontSize: 10
          }
        ]
      },
      content: [
        { image: this.logo, width: 100, margin: [10, -25, 0, 5] },
        { text: localStorage.getItem('name_empresa'), bold: true, fontSize: 21, alignment: 'center', margin: [0, -30, 0, 10] },
        { text: 'Horas Registradas Según Timbres', bold: true, fontSize: 12, alignment: 'center', margin: [0, 0, 0, 10] },
        { text: 'Periodo del: ' + this.f_inicio_req + " al " + this.f_final_req, bold: true, fontSize: 12, alignment: 'center', margin: [0, 0, 0, 10]  },
        { text: 'Nota: El siguiente reporte muestra el horario de los empleados y sus timbres realizados. Estos timbres no refieren a horas suplementarias ni horas extras autorizadas.' , bold: true, fontSize: 7 },
        ...this.impresionDatosPDF(this.data_pdf).map(obj => {
          return obj
        })
      ],
      styles: {
        tableTotal: { fontSize: 13, bold: true, alignment: 'center', fillColor: this.s_color},
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableInfo: { fontSize: 10, margin: [0, 3, 0, 3], fillColor: this.s_color },
        itemsTableInfoBlanco: { fontSize: 10, margin: [0, 3, 0, 3], fillColor: this.p_color},
        itemsTableCentrado: { fontSize: 10, alignment: 'center' },
        subtitulos: { fontSize: 16, alignment: 'center', margin: [0, 5, 0, 10] },
        tableMargin: { margin: [0, 0, 0, 20] },
        tableMarginCabecera: { margin: [0, 10, 0, 0] },
        CabeceraTabla: { fontSize: 12, alignment: 'center', margin: [0, 8, 0, 8], fillColor: this.p_color },
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 8, color: 'blue', opacity: 0.5 }
      }
    };
  }

  impresionDatosPDF(data: any []): Array<any>{    let n = []
    let c = 0;

    data.forEach((obj: IReporteHorasTrabaja) => {
      
      if (this.bool_dep === true || this.bool_suc === true) {
        n.push({
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  border: [true, true, false, true],
                  bold: true,
                  text: 'CIUDAD: ' + obj.ciudad,
                  style: 'itemsTableInfo'
                },
                {
                  border: [false, true, true, true],
                  text: 'SUCURSAL: ' + obj.name_suc,
                  style: 'itemsTableInfo'
                }
              ]
            ]
          }
        })
      }

      obj.departamentos.forEach(obj1 => {

        // LA CABECERA CUANDO SE GENERA EL PDF POR DEPARTAMENTOS
        if (this.bool_dep === true) {
          let arr_reg = obj1.empleado.map(o => { return o.timbres.length})
          let reg = this.SumarRegistros(arr_reg);
          n.push({
            style: 'tableMarginCabecera',
            table: {
              widths: ['*','*'],
              body: [
                [
                  {
                    border: [true, true, false, true],
                    text: 'DEPARTAMENTO: ' + obj1.name_dep,
                    style: 'itemsTableInfoBlanco'
                  },
                  {
                    border: [true, false, true, true],
                    text: 'N° REGISTROS: ' + reg,
                    style: 'itemsTableInfoBlanco'
                  }
                ]
              ]
            }
          })
        }

        obj1.empleado.forEach(obj2 => {

          n.push({
            style: 'tableMarginCabecera',
            table: {
              widths: ['*', 'auto', 'auto'],
              body: [
                [
                  {
                    border: [true, true, false, false],
                    text: 'EMPLEADO: ' + obj2.name_empleado,
                    style: 'itemsTableInfoBlanco'
                  },
                  {
                    border: [false, true, false, false],
                    text: 'C.C.: ' + obj2.cedula,
                    style: 'itemsTableInfoBlanco'
                  },
                  {
                    border: [false, true, true, false],
                    text: 'COD: ' + obj2.codigo,
                    style: 'itemsTableInfoBlanco'
                  }
                ]
              ]
            }
          });

          obj2.timbres.forEach((obj3) => {
            let item_color_total = (obj3.total_diferencia.includes('-')) ? 'red':'black';

            n.push({
              style: 'tableMargin',
              table: {
                widths: ['auto', '*', '*', '*', '*', '*'],
                body: [
                  [
                    { colSpan: 6, text: 'FECHA: ' + obj3.fecha },
                    '', '', '', '',''
                  ],                  
                  [
                    { text: 'N°', style: 'tableHeader' },
                    { text: 'Observación', style: 'tableHeader' },
                    { text: 'Acción', style: 'tableHeader' },
                    { text: 'Horario Trabajo', style: 'tableHeader' },
                    { text: 'Timbre', style: 'tableHeader' },
                    { text: 'Diferencia', style: 'tableHeader' },
                  ],                  
                  ...obj3.horarios.map(obj4 => {
                    let item_color = (obj4.hora_diferencia.includes('-')) ? 'red':'black';
                    c = c + 1
                    return [
                      { style: 'itemsTableCentrado', text: c },
                      { style: 'itemsTable', text: obj4.observacion },
                      { style: 'itemsTableCentrado', text: obj4.accion },
                      { style: 'itemsTableCentrado', text: obj4.hora_horario },
                      { style: 'itemsTableCentrado', text: obj4.hora_timbre },
                      { style: 'itemsTableCentrado', text: obj4.hora_diferencia, color: item_color},
                    ]
                  }),
                  [
                    { colSpan: 3, text: 'TOTAL', style: 'tableTotal' },
                    '', '',
                    { text: obj3.total_horario, bold: true, alignment: 'center' },
                    { text: obj3.total_timbres, bold: true, alignment: 'center' },
                    { text: obj3.total_diferencia, bold: true, alignment: 'center', color: item_color_total},
                  ]
                ]
              },
              layout: {
                fillColor: function (rowIndex) {
                  return (rowIndex % 2 === 0) ? '#E5E7E9' : null;
                }
              }
            });

          })

        });

      });

    });
    
    return n
  }
  
  SumarRegistros(array: any []) {
    let valor = 0;
    for (let i = 0; i < array.length; i++) {
        valor = valor + array[i];
    }
    return valor
  }

  /****************************************************************************************************** 
   *                                       MÉTODO PARA EXPORTAR A EXCEL
   ******************************************************************************************************/
   exportToExcel(): void {

    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.MapingDataPdfDefault(this.data_pdf));
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'Horas Trabajadas');
    xlsx.writeFile(wb, "Horas Trabajadas" + new Date().getTime() + '.xlsx');
    
  }

  MapingDataPdfDefault(array: Array<any>) {
    let nuevo: Array<any> = [];
    array.forEach((obj1:IReporteHorasTrabaja ) => {
      obj1.departamentos.forEach(obj2 => {
        obj2.empleado.forEach(obj3 => {
          obj3.timbres.forEach((obj4) => {
            obj4.horarios.forEach(obj5 => {
              let ele = {
                'Id Sucursal': obj1.id_suc, 'Ciudad': obj1.ciudad, 'Sucursal': obj1.name_suc, 
                'Id Departamento': obj2.id_depa, 'Departamento': obj2.name_dep,
                'Id Empleado': obj3.id, 'Nombre Empleado': obj3.name_empleado, 'Cédula': obj3.cedula, 'Código': obj3.codigo,
                'Género': obj3.genero, 'Fecha': obj4.fecha, 'Hora Horario': obj5.hora_horario, 'Hora Timbre': obj5.hora_timbre, 
                'Observación': obj5.observacion, 'Acción': obj5.accion, 'Diferencia': obj5.hora_diferencia,
              }
              nuevo.push(ele)
            })
          })
        })
      })
    })
    return nuevo
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedSuc() {
    const numSelected = this.selectionSuc.selected.length;
    return numSelected === this.sucursales.length
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggleSuc() {
    this.isAllSelectedSuc() ?
      this.selectionSuc.clear() :
      this.sucursales.forEach(row => this.selectionSuc.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabelSuc(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedSuc() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionSuc.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedDep() {
    const numSelected = this.selectionDep.selected.length;
    return numSelected === this.departamentos.length
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggleDep() {
    this.isAllSelectedDep() ?
      this.selectionDep.clear() :
      this.departamentos.forEach(row => this.selectionDep.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabelDep(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedDep() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionDep.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedEmp() {
    const numSelected = this.selectionEmp.selected.length;
    return numSelected === this.empleados.length
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggleEmp() {
    this.isAllSelectedEmp() ?
      this.selectionEmp.clear() :
      this.empleados.forEach(row => this.selectionEmp.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabelEmp(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedEmp() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionEmp.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  limpiarCamposRango() {
    this.fechasForm.reset();
    this.habilitar = false;
    this.estilo = { 'visibility': 'hidden' };
  }

  /**
   * METODOS PARA CONTROLAR INGRESO DE LETRAS
   */

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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  limpiarCampos() {
    if (this.bool_emp) {
      this.codigo.reset();
      this.cedula.reset();
      this.nombre_emp.reset();
    }
    if (this.bool_dep) {
      this.nombre_dep.reset();
    }
    if (this.bool_suc) {
      this.nombre_suc.reset();
    }
  }

}
