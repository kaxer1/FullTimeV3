import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ITableEmpleados, IReporteTimbres, tim_tabulado, IReporteTimbresIncompletos, timbre} from 'src/app/model/reportes.model';
import { ReportesAsistenciasService } from 'src/app/servicios/reportes/reportes-asistencias.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';

@Component({
  selector: 'app-reporte-timbres-multiples',
  templateUrl: './reporte-timbres-multiples.component.html',
  styleUrls: ['./reporte-timbres-multiples.component.css'],
})
export class ReporteTimbresMultiplesComponent implements OnInit, OnDestroy {
  
  get rangoFechas () { return this.reporteService.rangoFechas };

  get opcion () { return this.reporteService.opcion };

  get bool() { return this.reporteService.criteriosBusqueda };

  respuesta: any [];
  sucursales: any = [];
  departamentos: any = [];
  empleados: any = [];
  tabulado: any = [];
  incompletos: any = [];
  
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

  get filtroNombreSuc() { return this.reporteService.filtroNombreSuc }
  
  get filtroNombreDep() { return this.reporteService.filtroNombreDep }

  get filtroCodigo() { return this.reporteService.filtroCodigo };
  get filtroCedula() { return this.reporteService.filtroCedula };
  get filtroNombreEmp() { return this.reporteService.filtroNombreEmp };

  get filtroCodigo_tab() { return this.reporteService.filtroCodigo_tab };
  get filtroCedula_tab() { return this.reporteService.filtroCedula_tab };
  get filtroNombreTab() { return this.reporteService.filtroNombreTab };
  
  get filtroCodigo_inc() { return this.reporteService.filtroCodigo_inc };
  get filtroCedula_inc() { return this.reporteService.filtroCedula_inc };
  get filtroNombreInc() { return this.reporteService.filtroNombreInc };
  
  constructor(
    private toastr: ToastrService,
    private reporteService: ReportesService,
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
  
  ngOnDestroy() {
    this.respuesta = [];
    this.sucursales = [];
    this.departamentos = [];
    this.empleados = [];
    this.tabulado = [];
    this.incompletos = [];
  }

  /**
   * VALIDACIONES REPORT
   */
  validacionReporte(action) {
    console.log('Rango de fechas',this.rangoFechas);
    
    if (this.rangoFechas.fec_inico === '' || this.rangoFechas.fec_final === '') return this.toastr.error('Primero valide fechas de busqueda') 
    if (this.bool.bool_suc === false && this.bool.bool_dep === false && this.bool.bool_emp === false 
        && this.bool.bool_tab === false && this.bool.bool_inc === false) return this.toastr.error('Seleccione un criterio de búsqueda') 
    console.log('opcion:', this.opcion);
    
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
        this.toastr.error('Algo a pasado', 'Seleccione criterio de busqueda')
        this.reporteService.DefaultFormCriterios()
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

    // console.log('SUCURSAL', suc);
    this.data_pdf = []
    this.R_asistencias.ReporteTimbresMultiple(suc, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
      this.data_pdf = res
      // console.log('DATA PDF', this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel('default'); break;
        default: this.generarPdf(accion); break;
      }
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
    // console.log('DEPARTAMENTOS', dep);
    this.data_pdf = []
    this.R_asistencias.ReporteTimbresMultiple(dep, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
      this.data_pdf = res
      // console.log('DATA PDF',this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel('default'); break;
        default: this.generarPdf(accion); break;
      }
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
    
    // console.log('EMPLEADOS', emp);
    this.data_pdf = []
    this.R_asistencias.ReporteTimbresMultiple(emp, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
      this.data_pdf = res
      // console.log('DATA PDF',this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel('default'); break;
        default: this.generarPdf(accion); break;
      }
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
    
    // console.log('TABULADO', tab);
    this.data_pdf = []
    this.R_asistencias.ReporteTimbrestabulados(tab, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
      this.data_pdf = res
      // console.log('TABULADO PDF',this.data_pdf
      switch (accion) {
        case 'excel': this.exportToExcel('tabulado'); break;
        default: this.generarPdf(accion); break;
      }
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
    
    // console.log('TIMBRES INCOMPLETOS', inc);
    this.data_pdf = []
    this.R_asistencias.ReporteTabuladoTimbresIncompletos(inc, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
      this.data_pdf = res
      // console.log('TIMBRES PDF',this.data_pdf);
      switch (accion) {
        case 'excel': this.exportToExcel('incompleto'); break;
        default: this.generarPdf(accion); break;
      }
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

    if (this.bool.bool_emp === true || this.bool.bool_suc === true || this.bool.bool_dep === true) {
      documentDefinition = this.getDocumentDefinicion();
    } else if (this.bool.bool_tab === true) {
      documentDefinition = this.getDocumentDefinicionTabulado();
    } else if (this.bool.bool_inc === true){
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
        { text: 'Reporte - Timbres', bold: true, fontSize: 18, alignment: 'center', margin: [0, -10, 0, 5] },
        { text: 'Periodo del: ' + this.rangoFechas.fec_inico + " al " + this.rangoFechas.fec_final, bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10]  },
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
      
      if (this.bool.bool_suc === true || this.bool.bool_dep === true) {
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
        if (this.bool.bool_dep === true) {
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
        { text: 'Periodo del: ' + this.rangoFechas.fec_inico + " al " + this.rangoFechas.fec_final, bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10]  },
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
        { text: 'Periodo del: ' + this.rangoFechas.fec_inico + " al " + this.rangoFechas.fec_final, bold: true, fontSize: 15, alignment: 'center', margin: [0, 10, 0, 10]  },
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


  /****************************************************************************************************** 
   *                                       MÉTODO PARA EXPORTAR A EXCEL
   ******************************************************************************************************/
   exportToExcel(tipo: string): void {
    switch (tipo) {
      case 'incompleto':
        const wsr_inc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.MapingDataPdfTimbresIncompletos(this.data_pdf));
        const wb_inc: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb_inc, wsr_inc, 'Timbres');
        xlsx.writeFile(wb_inc, "Timbres_Incompletos" + new Date().getTime() + '.xlsx');
        break;
      case 'tabulado':
        const wsr_tab: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.MapingDataPdfTabulado(this.data_pdf));
        const wb_tab: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb_tab, wsr_tab, 'Timbres');
        xlsx.writeFile(wb_tab, "Timbres_Tabulado" + new Date().getTime() + '.xlsx');
        break;
      default:
        const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.MapingDataPdfDefault(this.data_pdf));
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, wsr, 'Timbres');
        xlsx.writeFile(wb, "Timbres_default" + new Date().getTime() + '.xlsx');
        break;
    }
    
  }

  MapingDataPdfDefault(array: Array<any>) {
    let nuevo: Array<any> = [];
    array.forEach((obj1: IReporteTimbres) => {
      obj1.departamentos.forEach(obj2 => {
        obj2.empleado.forEach(obj3 => {
          obj3.timbres.forEach((obj4: timbre) => {
            let ele = {
              'Id Sucursal': obj1.id_suc, 'Ciudad': obj1.ciudad, 'Sucursal': obj1.name_suc, 
              'Id Departamento': obj2.id_depa, 'Departamento': obj2.name_dep,
              'Id Empleado': obj3.id, 'Nombre Empleado': obj3.name_empleado, 'Cédula': obj3.cedula, 'Código': obj3.codigo,
              'Fecha Timbre': obj4.fec_hora_timbre.split(' ')[0], 'Hora Timbre': obj4.fec_hora_timbre.split(' ')[1],
              'Acción': obj4.accion, 'Id Reloj': obj4.id_reloj, 
              'Latitud': obj4.latitud, 'Longitud': obj4.longitud, 'Observación': obj4.observacion
            }
            nuevo.push(ele)
          })
        })
      })
    })
    return nuevo
  }
  
  MapingDataPdfTabulado(array: Array<any>) {
    let nuevo: Array<any> = [];
    array.forEach((obj1: IReporteTimbres) => {
      obj1.departamentos.forEach(obj2 => {
        obj2.empleado.forEach(obj3 => {
          obj3.timbres.forEach((obj4: tim_tabulado) => {
            let ele = {
              'Id Sucursal': obj1.id_suc, 'Ciudad': obj1.ciudad, 'Sucursal': obj1.name_suc, 
              'Id Departamento': obj2.id_depa, 'Departamento': obj2.name_dep,
              'Id Empleado': obj3.id, 'Nombre Empleado': obj3.name_empleado, 'Cédula': obj3.cedula, 'Código': obj3.codigo,
              'Contrado': obj3.contrato, 'Cargo': obj3.cargo,
              'Fecha Timbre': obj4.fecha.split(' ')[0], 'Hora Timbre': obj4.fecha.split(' ')[1], 'Género': obj3.genero,
              'Entrada': obj4.entrada, 'Salida Almuerzo': obj4.sal_Alm, 'Entrada Almuerzo': obj4.ent_Alm, 'Salida': obj4.salida,
              'Observación': obj4.desconocido
            }
            nuevo.push(ele)
          })
        })
      })
    })
    return nuevo
  }

  MapingDataPdfTimbresIncompletos(array: Array<any>) {
    let nuevo: Array<any> = [];
    array.forEach((obj1: IReporteTimbresIncompletos) => {
      obj1.departamentos.forEach(obj2 => {
        obj2.empleado.forEach(obj3 => {
          obj3.timbres.forEach(obj4 => {
            obj4.timbres_hora.forEach(obj5 => {
              let ele = {
                'Id Sucursal': obj1.id_suc, 'Ciudad': obj1.ciudad, 'Sucursal': obj1.name_suc, 
                'Id Departamento': obj2.id_depa, 'Departamento': obj2.name_dep,
                'Id Empleado': obj3.id, 'Nombre Empleado': obj3.name_empleado, 'Cédula': obj3.cedula, 'Código': obj3.codigo,
                'Contrado': obj3.contrato, 'Cargo': obj3.cargo, 'Género': obj3.genero,
                'Fecha Timbre': obj4.fecha.split(' ')[0], 'Hora Timbre': obj4.fecha.split(' ')[1],
                'Hora': obj5.hora, 'Tipo': obj5.tipo, 
              }
              nuevo.push(ele)
            })
          })
        })
      })
    })
    return nuevo
  }

  /*****************************************************************************
   * 
   * 
   * Varios Metodos Complementarios al funcionamiento. 
   * 
   * 
   **************************************************************************/

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
    if (this.bool.bool_suc === true) {
      this.tamanio_pagina_suc = e.pageSize;
      this.numero_pagina_suc = e.pageIndex + 1;
    } else if (this.bool.bool_dep === true) {
      this.tamanio_pagina_dep = e.pageSize;
      this.numero_pagina_dep = e.pageIndex + 1;
    } else if (this.bool.bool_emp === true) {
      this.tamanio_pagina_emp = e.pageSize;
      this.numero_pagina_emp = e.pageIndex + 1;
    } else if (this.bool.bool_tab === true) {
      this.tamanio_pagina_tab = e.pageSize;
      this.numero_pagina_tab = e.pageIndex + 1;
    } else if (this.bool.bool_inc === true) {
      this.tamanio_pagina_inc = e.pageSize;
      this.numero_pagina_inc = e.pageIndex + 1;
    }
  }

  /**
   * METODOS PARA CONTROLAR INGRESO DE LETRAS
   */

  IngresarSoloLetras(e) {
    return this.reporteService.IngresarSoloLetras(e)
  }

  IngresarSoloNumeros(evt) {
    return this.reporteService.IngresarSoloNumeros(evt)
  }

  
}
