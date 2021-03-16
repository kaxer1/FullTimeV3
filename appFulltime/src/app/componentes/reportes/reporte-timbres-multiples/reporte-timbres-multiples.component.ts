import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { ITableEmpleados, IReporteTimbres, tim_tabulado, IReporteTimbresIncompletos} from 'src/app/model/reportes.model';
import { ReportesAsistenciasService } from 'src/app/servicios/reportes/reportes-asistencias.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-reporte-timbres-multiples',
  templateUrl: './reporte-timbres-multiples.component.html',
  styleUrls: ['./reporte-timbres-multiples.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class ReporteTimbresMultiplesComponent implements OnInit {

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
  tabulado: any = [];
  incompletos: any = [];
  bool_suc: boolean = false;
  bool_dep: boolean = false;
  bool_emp: boolean = false;
  bool_tab: boolean = false;
  bool_inc: boolean = false;
  data_pdf: any = [];

  selectionSuc = new SelectionModel<ITableEmpleados>(true, []);
  selectionDep = new SelectionModel<ITableEmpleados>(true, []);
  selectionEmp = new SelectionModel<ITableEmpleados>(true, []);
  selectionTab = new SelectionModel<ITableEmpleados>(true, []);
  selectionInc = new SelectionModel<ITableEmpleados>(true, []);
  
  // Items de paginación de la tabla SUCURSAL
  tamanio_pagina_suc: number = 5;
  numero_pagina_suc: number = 1;
  pageSizeOptions_suc = [5, 10, 20, 50];
  // Items de paginación de la tabla DEPARTAMENTO
  tamanio_pagina_dep: number = 5;
  numero_pagina_dep: number = 1;
  pageSizeOptions_dep = [5, 10, 20, 50];
  // Items de paginación de la tabla EMPLEADOS
  tamanio_pagina_emp: number = 5;
  numero_pagina_emp: number = 1;
  pageSizeOptions_emp = [5, 10, 20, 50];
  // Items de paginación de la tabla TABULACION
  tamanio_pagina_tab: number = 5;
  numero_pagina_tab: number = 1;
  pageSizeOptions_tab = [5, 10, 20, 50];
  // Items de paginación de la tabla INCOMPLETOS
  tamanio_pagina_inc: number = 5;
  numero_pagina_inc: number = 1;
  pageSizeOptions_inc = [5, 10, 20, 50];

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

  filtroCodigo_tab: number;
  filtroCedula_tab: '';
  filtroNombreTab: '';

  filtroCodigo_inc: number;
  filtroCedula_inc: '';
  filtroNombreInc: '';

  check: any[] = [
    {opcion: 1, valor: 'Sucursal'},
    {opcion: 2, valor: 'Departamento'},
    {opcion: 3, valor: 'Empleado'},
    {opcion: 4, valor: 'Tabulado'},
    {opcion: 5, valor: 'Incompletos'}
  ];
  
  constructor(
    private toastr: ToastrService,
    private R_asistencias: ReportesAsistenciasService,
    private restEmpre: EmpresaService
  ) { 
    this.ObtenerLogo();
    this.ObtenerColores();
  }

  ngOnInit(): void {
    sessionStorage.removeItem('reporte_timbres_multiple');
    this.R_asistencias.Departamentos().subscribe((res: any[]) => {
      sessionStorage.setItem('reporte_timbres_multiple', JSON.stringify(res))
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
            let elemento = {
              id: r.id,
              nombre: r.name_empleado,
              codigo: r.codigo,
              cedula: r.cedula
            }
            this.empleados.push(elemento)
            this.tabulado.push(elemento)
            this.incompletos.push(elemento)
          })
        })
      })
      // console.log('SUCURSALES',this.sucursales);
      // console.log('DEPARTAMENTOS',this.departamentos);
      // console.log('EMPLEADOS',this.empleados);
      // console.log('TABULADO',this.tabulado);
      // console.log('INCOMPLETOS',this.incompletos);
      
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  opcion: number;
  BuscarPorTipo(e: MatRadioChange) {
    console.log(e.value);
    
    this.opcion = e.value;
    switch (this.opcion) {
      case 1:
        this.bool_suc = true; this.bool_dep = false; this.bool_emp = false; this.bool_tab = false; this.bool_inc = false;
      break;
      case 2:
        this.bool_dep = true; this.bool_suc = false; this.bool_emp = false; this.bool_tab = false; this.bool_inc = false;
      break;
      case 3:
        this.bool_emp = true; this.bool_suc = false; this.bool_dep = false; this.bool_tab = false; this.bool_inc = false;
      break;
      case 4:
        this.bool_tab = true; this.bool_suc = false; this.bool_dep = false; this.bool_emp = false; this.bool_inc = false;
      break;
      case 5:
        this.bool_inc = true; this.bool_suc = false; this.bool_dep = false; this.bool_emp = false; this.bool_tab = false;
      break;
      default:
        this.bool_suc = false; this.bool_dep = false; this.bool_emp = false; this.bool_tab = false; this.bool_inc = false;
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
    if (this.bool_suc === false && this.bool_dep === false && this.bool_emp === false 
        && this.bool_tab === false && this.bool_inc === false) return this.toastr.error('Seleccione un criterio de búsqueda') 

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
      case 4:
        if (this.selectionTab.selected.length === 0) return this.toastr.error('No a seleccionado ninguno', 'Seleccione empleados')
        this.ModelarTabulado(action);
      break;
      case 5:
        if (this.selectionInc.selected.length === 0) return this.toastr.error('No a seleccionado ninguno', 'Seleccione empleados')
        this.ModelarTimbresIncompleto(action);
      break;
      default:
        this.bool_suc = false; this.bool_dep = false; this.bool_emp = false; this.bool_tab = false; this.bool_inc = false;
        break;
    }
  }

  ModelarSucursal(accion) {

    let respuesta = JSON.parse(sessionStorage.getItem('reporte_timbres_multiple'))

    let suc = respuesta.filter(o => {
      var bool =  this.selectionSuc.selected.find(obj1 => {
        return obj1.id === o.id_suc
      })
      return bool != undefined
    })

    console.log('SUCURSAL', suc);
    this.data_pdf = []
    this.R_asistencias.ReporteTimbresMultiple(suc, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log('DATA PDF', this.data_pdf);
      this.generarPdf(accion)
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  ModelarDepartamento(accion) {
    
    let respuesta = JSON.parse(sessionStorage.getItem('reporte_timbres_multiple'))

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
    this.R_asistencias.ReporteTimbresMultiple(dep, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log('DATA PDF',this.data_pdf);
      this.generarPdf(accion)
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  ModelarEmpleados(accion) {

    let respuesta = JSON.parse(sessionStorage.getItem('reporte_timbres_multiple'))

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
    this.R_asistencias.ReporteTimbresMultiple(emp, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log('DATA PDF',this.data_pdf);
      this.generarPdf(accion)
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  ModelarTabulado(accion) {

    let respuesta = JSON.parse(sessionStorage.getItem('reporte_timbres_multiple'))

    respuesta.forEach((obj: any) => {
      obj.departamentos.forEach(element => {
        element.empleado = element.empleado.filter(o => {
          var bool =  this.selectionTab.selected.find(obj1 => {
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

    let tab = respuesta.filter(obj => { 
      return obj.departamentos.length > 0
    });
    
    console.log('TABULADO', tab);
    this.data_pdf = []
    this.R_asistencias.ReporteTimbrestabulados(tab, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log('TABULADO PDF',this.data_pdf);
      this.generarPdf(accion)
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  ModelarTimbresIncompleto(accion) {

    let respuesta = JSON.parse(sessionStorage.getItem('reporte_timbres_multiple'))

    respuesta.forEach((obj: any) => {
      obj.departamentos.forEach(element => {
        element.empleado = element.empleado.filter(o => {
          var bool =  this.selectionInc.selected.find(obj1 => {
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

    let inc = respuesta.filter(obj => { 
      return obj.departamentos.length > 0
    });
    
    console.log('TIMBRES INCOMPLETOS', inc);
    this.data_pdf = []
    this.R_asistencias.ReporteTabuladoTimbresIncompletos(inc, this.f_inicio_req, this.f_final_req).subscribe(res => {
      this.data_pdf = res
      console.log('TIMBRES PDF',this.data_pdf);
      this.generarPdf(accion)
    }, err => {
      this.toastr.error(err.error.message)
    })
  }


  /***********************************
   * 
   * COLORES Y LOGO PARA EL REPORTE
   * 
   ***********************************/

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
   ******************************************************/

  generarPdf(action) {
    let documentDefinition;

    if (this.bool_emp === true || this.bool_suc === true || this.bool_dep === true) {
      documentDefinition = this.getDocumentDefinicion();
    } else if (this.bool_tab === true) {
      documentDefinition = this.getDocumentDefinicionTabulado();
    } else if (this.bool_inc === true){
      documentDefinition = this.getDocumentDefinicionTimbresIncompletos();
    }

    var f = new Date()
    let doc_name = "Reporte Timbres" + f.toLocaleString() + ".pdf";
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
      pageMargins: [ 40, 50, 40, 50 ],
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + localStorage.getItem('fullname_print'), margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        h.setUTCHours(h.getHours());
        var time = h.toJSON().split("T")[1].split(".")[0];
        
        return {
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
      },
      content: [
        { image: this.logo, width: 100, margin: [10, -25, 0, 5] },
        { text: localStorage.getItem('name_empresa'), bold: true, fontSize: 21, alignment: 'center', margin: [0, -30, 0, 10] },
        { text: 'Reporte - Timbres', bold: true, fontSize: 18, alignment: 'center', margin: [0, 10, 0, 10] },
        { text: 'Periodo del: ' + this.f_inicio_req + " al " + this.f_final_req, bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10]  },
        ...this.impresionDatosPDF(this.data_pdf).map(obj => {
          return obj
        })
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8 },
        itemsTableInfo: { fontSize: 10, margin: [0, 3, 0, 3], fillColor: this.s_color },
        itemsTableInfoBlanco: { fontSize: 10, margin: [0, 3, 0, 3], fillColor: '#E3E3E3'},
        itemsTableCentrado: { fontSize: 10, alignment: 'center' },
        tableMargin: { margin: [0, 0, 0, 20] },
        tableMarginCabecera: { margin: [0, 10, 0, 0] },
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 8, color: 'blue', opacity: 0.5 }
      }
    };
  }

  impresionDatosPDF(data: any []): Array<any>{
    let n = []
    let c = 0;

    data.forEach((obj: IReporteTimbres) => {
      
      if (this.bool_suc === true || this.bool_dep === true) {
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
                    border: [true, true, true, true],
                    text: 'N° REGISTROS: ' + reg,
                    style: 'itemsTableInfoBlanco'
                  }
                ]
              ]
            }
          })
        }

        obj1.empleado.forEach((obj2: any) => {

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

          n.push({
            style: 'tableMargin',
            table: {
              widths: ['auto', '*', 'auto', 'auto', 'auto', '*', '*'],
              body: [
                [
                  { text: 'N°', style: 'tableHeader' },
                  { text: 'Timbre', style: 'tableHeader' },
                  { text: 'Reloj', style: 'tableHeader' },
                  { text: 'Accion', style: 'tableHeader' },
                  { text: 'Observacion', style: 'tableHeader' },
                  { text: 'Longuitud', style: 'tableHeader' },
                  { text: 'Latitud', style: 'tableHeader' }
                ],                  
                ...obj2.timbres.map(obj3 => {
                  c = c + 1
                  return [
                    { style: 'itemsTableCentrado', text: c },
                    { style: 'itemsTable', text: obj3.fec_hora_timbre },
                    { style: 'itemsTable', text: obj3.id_reloj },
                    { style: 'itemsTable', text: obj3.accion },
                    { style: 'itemsTable', text: obj3.observacion },
                    { style: 'itemsTable', text: obj3.longitud },
                    { style: 'itemsTable', text: obj3.latitud },
                  ]
                })

              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return (rowIndex % 2 === 0) ? '#E5E7E9' : null;
              }
            }
          })
        });

      });

    })
    
    return n
  }

  getDocumentDefinicionTabulado() {
    return {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [ 40, 50, 40, 50 ],
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + localStorage.getItem('fullname_print'), margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        h.setUTCHours(h.getHours());
        var time = h.toJSON().split("T")[1].split(".")[0];
        
        return {
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
      },
      content: [
        { image: this.logo, width: 100, margin: [10, -25, 0, 5] },
        { text: localStorage.getItem('name_empresa'), bold: true, fontSize: 21, alignment: 'center', margin: [0, -30, 0, 10] },
        { text: 'Reporte Tabulado de Timbres', bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10] },
        { text: 'Periodo del: ' + this.f_inicio_req + " al " + this.f_final_req, bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10]  },
        this.impresionDatosPDFtabulado(this.data_pdf)
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8 },
        itemsTableCentrado: { fontSize: 10, alignment: 'center' },
        tableMargin: { margin: [0, 0, 0, 20] },
        tableMarginCabecera: { margin: [0, 10, 0, 0] },
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 8, color: 'blue', opacity: 0.5 }
      }
    };
  }

  impresionDatosPDFtabulado(data: any []){
    let n = []
    let c = 0;
    let arrayTab: any = [];

    data.forEach((obj: IReporteTimbres) => {
      obj.departamentos.forEach(obj1 => {
        obj1.empleado.forEach((obj2: any) => {
          let cont_emp = 0;

          obj2.timbres.map((obj3: tim_tabulado) => {
            c = c + 1;
            cont_emp = cont_emp + 1;
            if (cont_emp === 1) {
              let ret = [
                { style: 'itemsTableCentrado', text: c },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj2.name_empleado },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj2.cedula },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj2.codigo },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj.ciudad },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj1.name_dep },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj2.cargo },
                { rowSpan: obj2.timbres.length, style: 'itemsTable', text: obj2.contrato },
                { style: 'itemsTable', text: obj3.fecha },
                { style: 'itemsTable', text: obj3.entrada },
                { style: 'itemsTable', text: obj3.sal_Alm },
                { style: 'itemsTable', text: obj3.ent_Alm },
                { style: 'itemsTable', text: obj3.salida },
                { style: 'itemsTable', text: obj3.desconocido },
              ]
              arrayTab.push(ret)
              return ret
            } else {
              let ret = [
                { style: 'itemsTableCentrado', text: c },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: '' },
                { style: 'itemsTable', text: obj3.fecha },
                { style: 'itemsTable', text: obj3.entrada },
                { style: 'itemsTable', text: obj3.sal_Alm },
                { style: 'itemsTable', text: obj3.ent_Alm },
                { style: 'itemsTable', text: obj3.salida },
                { style: 'itemsTable', text: obj3.desconocido },
              ]
              arrayTab.push(ret)
              return ret
            }
            
          })

        });

      });

    })
    
    return {
      style: 'tableMargin',
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'N°', style: 'tableHeader' },
            { text: 'Empleado', style: 'tableHeader' },
            { text: 'Cédula', style: 'tableHeader' },
            { text: 'Cod.', style: 'tableHeader' },
            { text: 'Ciudad', style: 'tableHeader' },
            { text: 'Departamento', style: 'tableHeader' },
            { text: 'Cargo', style: 'tableHeader' },
            { text: 'Contrato', style: 'tableHeader' },
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Entrada', style: 'tableHeader' },
            { text: 'Sal.Alm', style: 'tableHeader' },
            { text: 'Ent.Alm', style: 'tableHeader' },
            { text: 'Salida', style: 'tableHeader' },
            { text: 'Desco.', style: 'tableHeader' }
          ],                  
          ...arrayTab.map(obj3 => {
            return obj3
          })

        ]
      },
      layout: {
        fillColor: function (rowIndex) {
          return (rowIndex % 2 === 0) ? '#E5E7E9' : null;
        }
      }
    }
  }

  getDocumentDefinicionTimbresIncompletos() {
    return {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [ 40, 50, 40, 50 ],
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + localStorage.getItem('fullname_print'), margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        h.setUTCHours(h.getHours());
        var time = h.toJSON().split("T")[1].split(".")[0];
        
        return {
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
      },
      content: [
        { image: this.logo, width: 100, margin: [10, -25, 0, 5] },
        { text: localStorage.getItem('name_empresa'), bold: true, fontSize: 21, alignment: 'center', margin: [0, -30, 0, 10] },
        { text: 'Reporte Tabulado de Timbres Incompletos', bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10] },
        { text: 'Periodo del: ' + this.f_inicio_req + " al " + this.f_final_req, bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10]  },
        this.impresionDatosPDFtimbresIncompleto(this.data_pdf)
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8 },
        itemsTableCentrado: { fontSize: 10, alignment: 'center' },
        tableMargin: { margin: [0, 0, 0, 20] },
        quote: { margin: [5, -2, 0, -2], italics: true },
        small: { fontSize: 8, color: 'blue', opacity: 0.5 }
      }
    };
  }
  
  impresionDatosPDFtimbresIncompleto(data: any []) {
    let n = []
    let c = 0;
    let arrayInc: any = [];

    data.forEach((obj: IReporteTimbresIncompletos) => {
      obj.departamentos.forEach(obj1 => {
        obj1.empleado.forEach(obj2 => {
          obj2.timbres.forEach(obj3 => {
            // console.log(obj3);
            obj3.timbres_hora.forEach((obj4:any) => {
              c = c + 1;
              let genero = '';
              (obj2.genero === 1) ? genero = 'M' : genero = 'F';
  
              let ret = [
                { style: 'itemsTableCentrado', text: c },
                { style: 'itemsTable', text: obj2.name_empleado },
                { style: 'itemsTable', text: obj2.cedula },
                { style: 'itemsTable', text: obj2.codigo },
                { style: 'itemsTable', text: genero},
                { style: 'itemsTable', text: obj.ciudad },
                { style: 'itemsTable', text: obj1.name_dep },
                { style: 'itemsTable', text: obj2.cargo },
                { style: 'itemsTable', text: obj2.contrato },
                { style: 'itemsTable', text: obj3.fecha },
                { style: 'itemsTable', text: obj4.tipo },
                { style: 'itemsTable', text: obj4.hora }
              ]
              arrayInc.push(ret)
            })    
          });
        });
      });
    });
    
    return {
      style: 'tableMargin',
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'N°', style: 'tableHeader' },
            { text: 'Empleado', style: 'tableHeader' },
            { text: 'Cédula', style: 'tableHeader' },
            { text: 'Código', style: 'tableHeader' },
            { text: 'Género', style: 'tableHeader' },
            { text: 'Ciudad', style: 'tableHeader' },
            { text: 'Departamento', style: 'tableHeader' },
            { text: 'Cargo', style: 'tableHeader' },
            { text: 'Contrato', style: 'tableHeader' },
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Tipo', style: 'tableHeader' },
            { text: 'Hora de Timbre', style: 'tableHeader' },
          ],                  
          ...arrayInc.map(obj => { return obj })
        ]
      },
      layout: {
        fillColor: function (rowIndex) {
          return (rowIndex % 2 === 0) ? '#E5E7E9' : null;
        }
      }
    }
  }
  
  SumarRegistros(array: any []) {
    let valor = 0;
    for (let i = 0; i < array.length; i++) {
        valor = valor + array[i];
    }
    return valor
  }

  HorasDecimalToHHMM(dato: number) {
    // console.log('Hora decimal a HHMM ======>',dato);
    var h = parseInt(dato.toString());
    var x = (dato - h) * 60;
    var m = parseInt(x.toString());

    let hora;
    let min;
    if (h < 10 && m < 10) {
        hora = '0' + h;
        min = '0' + m;
    } else if (h < 10 && m >= 10) {
        hora = '0' + h;
        min = m;
    } else if (h >= 10 && m < 10) {
        hora = h;
        min = '0' + m;
    } else if (h >= 10 && m >= 10) {
        hora = h;
        min = m;
    }

    return hora + ':' + min + ':00'
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

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedTab() {
    const numSelected = this.selectionTab.selected.length;
    return numSelected === this.tabulado.length
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggleTab() {
    this.isAllSelectedTab() ?
      this.selectionTab.clear() :
      this.tabulado.forEach(row => this.selectionTab.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabelTab(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedTab() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionTab.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedInc() {
    const numSelected = this.selectionInc.selected.length;
    return numSelected === this.incompletos.length
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggleInc() {
    this.isAllSelectedInc() ?
      this.selectionInc.clear() :
      this.incompletos.forEach(row => this.selectionInc.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabelInc(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedInc() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionInc.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ManejarPagina(e: PageEvent) {
    if (this.bool_suc === true) {
      this.tamanio_pagina_suc = e.pageSize;
      this.numero_pagina_suc = e.pageIndex + 1;
    } else if (this.bool_dep === true) {
      this.tamanio_pagina_dep = e.pageSize;
      this.numero_pagina_dep = e.pageIndex + 1;
    } else if (this.bool_emp === true) {
      this.tamanio_pagina_emp = e.pageSize;
      this.numero_pagina_emp = e.pageIndex + 1;
    } else if (this.bool_tab === true) {
      this.tamanio_pagina_tab = e.pageSize;
      this.numero_pagina_tab = e.pageIndex + 1;
    } else if (this.bool_inc === true) {
      this.tamanio_pagina_inc = e.pageSize;
      this.numero_pagina_inc = e.pageIndex + 1;
    }
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
    if (this.bool_emp === true || this.bool_tab === true || this.bool_inc === true ) {
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
