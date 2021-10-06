// IMPORTAR LIBRERIAS
import { ITableEmpleados, ReporteHoraExtra, hora } from 'src/app/model/reportes.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { ToastrService } from 'ngx-toastr';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import * as xlsx from 'xlsx';

// IMPORTAR SERVICIOS
import { ReportesAsistenciasService } from 'src/app/servicios/reportes/reportes-asistencias.service';
import { ValidacionesService } from '../../../../servicios/validaciones/validaciones.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

@Component({
  selector: 'app-horas-planificadas',
  templateUrl: './horas-planificadas.component.html',
  styleUrls: ['./horas-planificadas.component.css']
})
export class HorasPlanificadasComponent implements OnInit, OnDestroy {

// CRITERIOS DE BÚSQUEDA POR FECHAS
get rangoFechas() { return this.reporteService.rangoFechas };

// MÉTODO QUE INDICA OPCIONES DE BÚSQUEDA SELECCIONADOS
get bool() { return this.reporteService.criteriosBusqueda };

// VARIABLE QUE INDICA NÚMERO DE OPCIONES DE BÚSQUEDA
get opcion() { return this.reporteService.opcion };

// VARIABLES DE ALMACENAMIENTO DE RESULTADOS
departamentos: any = [];
sucursales: any = [];
empleados: any = [];
respuesta: any[];

// VARIABLE DE ALMACENAMIENTO DE DATOS DE PDF
data_pdf: any = [];

// VARIABLES DE ALMACENAMIENTO DE DATOS SELECCIONADOS EN LA BÚSQUEDA
selectionSuc = new SelectionModel<ITableEmpleados>(true, []);
selectionDep = new SelectionModel<ITableEmpleados>(true, []);
selectionEmp = new SelectionModel<ITableEmpleados>(true, []);

// ITEMS DE PAGINACIÓN DE LA TABLA SUCURSAL
numero_pagina_suc: number = 1;
tamanio_pagina_suc: number = 5;
pageSizeOptions_suc = [5, 10, 20, 50];

// ITEMS DE PAGINACIÓN DE LA TABLA DEPARTAMENTO
numero_pagina_dep: number = 1;
tamanio_pagina_dep: number = 5;
pageSizeOptions_dep = [5, 10, 20, 50];

// ITEMS DE PAGINACIÓN DE LA TABLA EMPLEADOS
numero_pagina_emp: number = 1;
tamanio_pagina_emp: number = 5;
pageSizeOptions_emp = [5, 10, 20, 50];

// MÉTODOS PARA BÚSQUEDA DE DATOS POR FILTROS SUCURSAL
get filtroNombreSuc() { return this.reporteService.filtroNombreSuc }

// MÉTODOS PARA BÚSQUEDA DE DATOS POR FILTROS DEPARTAMENTO
get filtroNombreDep() { return this.reporteService.filtroNombreDep }

// MÉTODOS PARA BÚSQUEDA DE DATOS POR FILTROS EMPLEADO
get filtroCodigo() { return this.reporteService.filtroCodigo };
get filtroCedula() { return this.reporteService.filtroCedula };
get filtroNombreEmp() { return this.reporteService.filtroNombreEmp };

constructor(
  private R_asistencias: ReportesAsistenciasService, // SERVICIO BÚSQUEDA DE DATOS DE DEPARTAMENTOS
  private validacionService: ValidacionesService, // VARIABLE DE VALIDACIONES DE INGRESO DE LETRAS O NÚMEROS
  private reporteService: ReportesService, // SERVICIO DATOS DE BÚSQUEDA GENERALES DE REPORTE
  private restEmpre: EmpresaService, // SERVICIO DATOS GENERALES DE EMPRESA
  private R_hora: PedHoraExtraService, // SERVICIO DATOS PARA REPORTE DE VACACIONES
  private toastr: ToastrService, // VARIABLE DE MANEJO DE NOTIFICACIONES
) {
  this.ObtenerLogo();
  this.ObtenerColores();
}

ngOnInit(): void {

  sessionStorage.removeItem('reporte_vacunas_multiples');
  // BÚSQUEDA DE DEPARTAMENTOS
  this.R_asistencias.Departamentos().subscribe((res: any[]) => {
    sessionStorage.setItem('reporte_vacunas_multiples', JSON.stringify(res))

    // BÚSQUEDA DE SUCURSALES
    this.sucursales = res.map(obj => {
      return {
        id: obj.id_suc,
        nombre: obj.name_suc
      }
    });

    // BÚSQUEDA DE DEPARTAMENTOS
    res.forEach(obj => {
      obj.departamentos.forEach(ele => {
        this.departamentos.push({
          id: ele.id_depa,
          nombre: ele.name_dep
        })
      })
    })

    // BÚSQUEDA DE DEPARTAMENTO - EMPLEADOS
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
        })
      })
    })
  }, err => {
    this.toastr.error(err.error.message)
  })
}

ngOnDestroy() {
  this.respuesta = [];
  this.sucursales = [];
  this.departamentos = [];
  this.empleados = [];
}

// VALIDACIONES DE REPORTES
validacionReporte(action) {
  if (this.rangoFechas.fec_inico === '' || this.rangoFechas.fec_final === '') return this.toastr.info('Primero valide fechas de búsqueda.');

  if (this.bool.bool_suc === false && this.bool.bool_dep === false && this.bool.bool_emp === false) return this.toastr.error('Seleccione un criterio de búsqueda.')
  switch (this.opcion) {
    case 1:
      if (this.selectionSuc.selected.length === 0) return this.toastr.error('No a seleccionado ninguno.', 'Seleccione sucursal.')
      this.ModelarSucursal(action);
      break;
    case 2:
      if (this.selectionDep.selected.length === 0) return this.toastr.error('No a seleccionado ninguno.', 'Seleccione departamentos.')
      this.ModelarDepartamento(action);
      break;
    case 3:
      if (this.selectionEmp.selected.length === 0) return this.toastr.error('No a seleccionado ninguno.', 'Seleccione empleados.')
      this.ModelarEmpleados(action);
      break;
    default:
      this.toastr.error('UPS! Al parecer algo falló.', 'Seleccione criterio de búsqueda.')
      this.reporteService.DefaultFormCriterios()
      break;
  }
}

// MODELAMIENTO DE DATOS DE ACUERDO A LAS SUCURSALES
ModelarSucursal(accion) {
  let respuesta = JSON.parse(sessionStorage.getItem('reporte_vacunas_multiples'))
  let suc = respuesta.filter(o => {
    var bool = this.selectionSuc.selected.find(obj1 => {
      return obj1.id === o.id_suc
    })
    return bool != undefined
  })
  this.data_pdf = []
  this.R_hora.BuscarHorasPlanificadas(suc, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
    this.data_pdf = res
    switch (accion) {
      case 'excel': this.exportToExcel('default'); break;
      default: this.generarPdf(accion); break;
    }
  }, err => {
    this.toastr.error(err.error.message)
  })
}

// MODELAMIENTO DE DATOS DE ACUERDO A LOS DEPARTAMENTOS
ModelarDepartamento(accion) {
  let respuesta = JSON.parse(sessionStorage.getItem('reporte_vacunas_multiples'))
  respuesta.forEach((obj: any) => {
    obj.departamentos = obj.departamentos.filter(o => {
      var bool = this.selectionDep.selected.find(obj1 => {
        return obj1.id === o.id_depa
      })
      return bool != undefined
    })
  })
  let dep = respuesta.filter(obj => {
    return obj.departamentos.length > 0
  });
  this.data_pdf = []
  this.R_hora.BuscarHorasPlanificadas(dep, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
    this.data_pdf = res
    switch (accion) {
      case 'excel': this.exportToExcel('default'); break;
      default: this.generarPdf(accion); break;
    }
  }, err => {
    this.toastr.error(err.error.message)
  })
}

// MODELAMIENTO DE DATOS DE ACUERDO A LOS EMPLEADOS
ModelarEmpleados(accion) {
  let respuesta = JSON.parse(sessionStorage.getItem('reporte_vacunas_multiples'))
  respuesta.forEach((obj: any) => {
    obj.departamentos.forEach(element => {
      element.empleado = element.empleado.filter(o => {
        var bool = this.selectionEmp.selected.find(obj1 => {
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
  this.data_pdf = []
  this.R_hora.BuscarHorasPlanificadas(emp, this.rangoFechas.fec_inico, this.rangoFechas.fec_final).subscribe(res => {
    this.data_pdf = res
    switch (accion) {
      case 'excel': this.exportToExcel('default'); break;
      default: this.generarPdf(accion); break;
    }
  }, err => {
    this.toastr.error(err.error.message)
  })
}

// OBTENER LOGO PARA EL REPORTE
logo: any = String;
ObtenerLogo() {
  this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
    this.logo = 'data:image/jpeg;base64,' + res.imagen;
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

/* **************************************************************************** *
 *                                   PDF                                        *
 * **************************************************************************** */

generarPdf(action) {
  let documentDefinition;

  if (this.bool.bool_emp === true || this.bool.bool_suc === true || this.bool.bool_dep === true) {
    documentDefinition = this.getDocumentDefinicion();
  }

  var f = new Date()
  let doc_name = "Reporte Solicitud de Vacaciones" + f.toLocaleString() + ".pdf";
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
    pageMargins: [40, 50, 40, 50],
    watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
    header: { text: 'Impreso por:  ' + localStorage.getItem('fullname_print'), margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

    footer: function (currentPage: any, pageCount: any, fecha: any, hora: any) {
      var h = new Date();
      var f = moment();
      fecha = f.format('YYYY-MM-DD');
      h.setUTCHours(h.getHours());
      var time = h.toJSON().split("T")[1].split(".")[0];

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
        ],
        fontSize: 10
      }
    },
    content: [
      { image: this.logo, width: 100, margin: [10, -25, 0, 5] },
      { text: localStorage.getItem('name_empresa').toLocaleUpperCase(), bold: true, fontSize: 21, alignment: 'center', margin: [0, -30, 0, 10] },
      { text: 'Reporte - Solicitud Vacaciones', bold: true, fontSize: 16, alignment: 'center', margin: [0, -10, 0, 5] },
      ...this.impresionDatosPDF(this.data_pdf).map(obj => {
        return obj
      })
    ],
    styles: {
      tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
      itemsTable: { fontSize: 8 },
      itemsTableInfo: { fontSize: 10, margin: [0, 3, 0, 3], fillColor: this.s_color },
      itemsTableInfoBlanco: { fontSize: 10, margin: [0, 3, 0, 3], fillColor: '#E3E3E3' },
      itemsTableCentrado: { fontSize: 10, alignment: 'center' },
      tableMargin: { margin: [0, 0, 0, 20] },
      tableMarginCabecera: { margin: [0, 10, 0, 0] },
      quote: { margin: [5, -2, 0, -2], italics: true },
      small: { fontSize: 8, color: 'blue', opacity: 0.5 }
    }
  };
}

impresionDatosPDF(data: any[]): Array<any> {
  let n = []
  let c = 0;

  data.forEach((obj: ReporteHoraExtra) => {

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
        let arr_reg = obj1.empleado.map(o => { return o.horaE.length })
        let reg = this.SumarRegistros(arr_reg);
        n.push({
          style: 'tableMarginCabecera',
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  border: [true, true, false, true],
                  text: 'DEPARTAMENTO: ' + obj1.name_dep,
                  style: 'itemsTableInfo'
                },
                {
                  border: [true, true, true, true],
                  text: 'N° REGISTROS: ' + reg,
                  style: 'itemsTableInfo'
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
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'N°', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Fecha Inicio', style: 'tableHeader' },
                { text: 'Fecha Final', style: 'tableHeader' },
                { text: 'Fecha Ingreso', style: 'tableHeader' },
                { text: 'Aprobado', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' },
              ],
              ...obj2.horaE.map(obj3 => {
                c = c + 1
                return [
                  { style: 'itemsTableCentrado', text: c },
                  { style: 'itemsTable', text: 'Vacaciones' },
                  { style: 'itemsTable', text: obj3.fec_inicio.split('T')[0] },
                  { style: 'itemsTable', text: obj3.fec_final.split('T')[0] },
                  { style: 'itemsTable', text: obj3.fec_ingreso.split('T')[0] },
                  { style: 'itemsTable', text: 'Jose Luis Altamirano Taco' },
                  { style: 'itemsTable', text: 'Autorizado' },
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

SumarRegistros(array: any[]) {
  let valor = 0;
  for (let i = 0; i < array.length; i++) {
    valor = valor + array[i];
  }
  return valor
}

/** ************************************************************************************************** * 
 ** *                                     MÉTODO PARA EXPORTAR A EXCEL                                 *
 ** ************************************************************************************************** */
exportToExcel(tipo: string): void {
  switch (tipo) {
    default:
      const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.MapingDataPdfDefault(this.data_pdf));
      const wb: xlsx.WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, wsr, 'Vacaciones');
      xlsx.writeFile(wb, "Vacaciones" + new Date().getTime() + '.xlsx');
      break;
  }

}

MapingDataPdfDefault(array: Array<any>) {
  let nuevo: Array<any> = [];
  array.forEach((obj1: ReporteHoraExtra) => {
    obj1.departamentos.forEach(obj2 => {
      obj2.empleado.forEach(obj3 => {
        obj3.horaE.forEach((obj4: hora) => {
         /* let ele = {
            'Id Sucursal': obj1.id_suc, 'Ciudad': obj1.ciudad, 'Sucursal': obj1.name_suc,
            'Id Departamento': obj2.id_depa, 'Departamento': obj2.name_dep,
            'Id Empleado': obj3.id, 'Nombre Empleado': obj3.name_empleado, 'Cédula': obj3.cedula, 'Código': obj3.codigo,
            'Descripcion': 'Vacaciones', 'fec_inicio': obj4.fec_inicio.split('T')[0], 'fec_final': obj4.fec_final.split('T')[0],
            'fec_ingreso': obj4.fec_ingreso.split('T')[0], 'Aprobacion': 'Jose Luis Altamirano Taco',
            'Estado': 'Autorizado'
          }*/
         // nuevo.push(ele)
        })
      })
    })
  })
  return nuevo
}

/** ************************************************************************************* *
 ** *            VARIOS METODOS COMPLEMENTARIOS AL FUNCIONAMIENTO                         *
 ** ************************************************************************************* */

// SI EL NÚMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NÚMERO TOTAL DE FILAS. 
isAllSelectedSuc() {
  const numSelected = this.selectionSuc.selected.length;
  return numSelected === this.sucursales.length
}

// SELECCIONA TODAS LAS FILAS SI NO ESTÁN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCIÓN CLARA. 
masterToggleSuc() {
  this.isAllSelectedSuc() ?
    this.selectionSuc.clear() :
    this.sucursales.forEach(row => this.selectionSuc.select(row));
}

// LA ETIQUETA DE LA CASILLA DE VERIFICACIÓN EN LA FILA PASADA
checkboxLabelSuc(row?: ITableEmpleados): string {
  if (!row) {
    return `${this.isAllSelectedSuc() ? 'select' : 'deselect'} all`;
  }
  return `${this.selectionSuc.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}

// SI EL NÚMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NÚMERO TOTAL DE FILAS. 
isAllSelectedDep() {
  const numSelected = this.selectionDep.selected.length;
  return numSelected === this.departamentos.length
}

// SELECCIONA TODAS LAS FILAS SI NO ESTÁN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCIÓN CLARA. 
masterToggleDep() {
  this.isAllSelectedDep() ?
    this.selectionDep.clear() :
    this.departamentos.forEach(row => this.selectionDep.select(row));
}

// LA ETIQUETA DE LA CASILLA DE VERIFICACIÓN EN LA FILA PASADA
checkboxLabelDep(row?: ITableEmpleados): string {
  if (!row) {
    return `${this.isAllSelectedDep() ? 'select' : 'deselect'} all`;
  }
  return `${this.selectionDep.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}

// SI EL NÚMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NÚMERO TOTAL DE FILAS. 
isAllSelectedEmp() {
  const numSelected = this.selectionEmp.selected.length;
  return numSelected === this.empleados.length
}

// SELECCIONA TODAS LAS FILAS SI NO ESTÁN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCIÓN CLARA. 
masterToggleEmp() {
  this.isAllSelectedEmp() ?
    this.selectionEmp.clear() :
    this.empleados.forEach(row => this.selectionEmp.select(row));
}

// LA ETIQUETA DE LA CASILLA DE VERIFICACIÓN EN LA FILA PASADA
checkboxLabelEmp(row?: ITableEmpleados): string {
  if (!row) {
    return `${this.isAllSelectedEmp() ? 'select' : 'deselect'} all`;
  }
  return `${this.selectionEmp.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}

// MÉTODO DE CONTROL DE PAGINACIÓN
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
  }
}

// MÉTODO PARA INGRESAR DATOS DE LETRAS O NÚMEROS
IngresarSoloLetras(e) {
  return this.validacionService.IngresarSoloLetras(e)
}

IngresarSoloNumeros(evt) {
  return this.validacionService.IngresarSoloNumeros(evt)
}

}
