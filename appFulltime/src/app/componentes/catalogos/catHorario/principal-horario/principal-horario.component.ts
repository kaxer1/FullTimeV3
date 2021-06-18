// IMPORTACIÓN DE LIBRERIAS
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

import { RegistroHorarioComponent } from 'src/app/componentes/catalogos/catHorario/registro-horario/registro-horario.component';
import { DetalleCatHorarioComponent } from 'src/app/componentes/catalogos/catHorario/detalle-cat-horario/detalle-cat-horario.component';
import { EditarHorarioComponent } from '../editar-horario/editar-horario.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

@Component({
  selector: 'app-principal-horario',
  templateUrl: './principal-horario.component.html',
  styleUrls: ['./principal-horario.component.css']
})

export class PrincipalHorarioComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  horarios: any = [];

  // filtros
  filtroNombreHorario = '';

  // Control de campos y validaciones del formulario
  nombreHorarioF = new FormControl('', [Validators.minLength(2)]);
  archivo1Form = new FormControl('');
  archivo2Form = new FormControl('');
  archivo3Form = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public buscarHorarioForm = new FormGroup({
    nombreHorarioForm: this.nombreHorarioF,
  });

  nameFile: string;
  archivoSubido: Array<File>;

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleado: any = [];
  idEmpleado: number;

  constructor(
    private rest: HorarioService,
    public restE: EmpleadoService,
    private restD: DetalleCatHorariosService,
    private toastr: ToastrService,
    public restEmpre: EmpresaService,
    public vistaRegistrarDatos: MatDialog,
    public router: Router,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerHorarios();
    this.nameFile = '';
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerLogo();
    this.ObtenerColores();
  }

  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  // Método para obtener el logo de la empresa
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

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerHorarios() {
    this.horarios = [];
    this.rest.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
    })
  }

  AbrirVentanaRegistrarHorario(): void {
    this.vistaRegistrarDatos.open(RegistroHorarioComponent, { width: '1200px' }).afterClosed().subscribe(items => {
      this.ObtenerHorarios();
    });
  }

  AbrirRegistraDetalle(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(DetalleCatHorarioComponent, { width: '600px', data: { datosHorario: datosSeleccionados, actualizar: false } }).afterClosed().subscribe(items => {
      this.ObtenerHorarios();
    });
  }

  LimpiarCampos() {
    this.buscarHorarioForm.setValue({
      nombreHorarioForm: '',
    });
    this.ObtenerHorarios();
  }

  AbrirVentanaEditarHorario(datosSeleccionados: any): void {
    this.vistaRegistrarDatos.open(EditarHorarioComponent, { width: '900px', data: { horario: datosSeleccionados, actualizar: false } }).afterClosed().subscribe(items => {
      this.ObtenerHorarios();
    });
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarDetalle(id_horario: number) {
    this.rest.EliminarRegistro(id_horario).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.ObtenerHorarios();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarDetalle(datos.id);
        } else {
          this.router.navigate(['/horario/']);
        }
      });
  }


  /****************************************************************************************************** 
   * PLANTILLA CARGAR SOLO HORARIOS
   ******************************************************************************************************/

  fileChangeCatalogoHorario(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 17);
    console.log("funcion horario", itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'catalogo horarios') {
        this.plantillaHorario();
      } else {
        this.toastr.error('Solo se acepta', 'Plantilla seleccionada incorrecta', {
          timeOut: 6000,
        });
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada', {
        timeOut: 6000,
      });
    }
  }

  plantillaHorario() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.VerificarDatosHorario(formData).subscribe(res => {
      if (res.message === 'error') {
        this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla. ' +
          'Son datos obligatorios: nombre de horario, horas de trabajo y tipo de horario, además el nombre ' +
          'de horario debe ser único en cada registro.', 'Operación Fallida', {
          timeOut: 6000,
        });
        this.archivo1Form.reset();
        this.nameFile = '';
      }
      else {
        this.rest.VerificarPlantillaHorario(formData).subscribe(res => {
          if (res.message === 'error') {
            this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla. ' +
              'Son datos obligatorios: nombre de horario, horas de trabajo y tipo de horario, además el nombre ' +
              'de horario debe ser único en cada registro.', 'Operación Fallida', {
              timeOut: 6000,
            });
            this.archivo1Form.reset();
            this.nameFile = '';
          }
          else {
            this.rest.CargarHorariosMultiples(formData).subscribe(res => {
              this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.', {
                timeOut: 6000,
              });
              this.archivo1Form.reset();
              this.nameFile = '';
              window.location.reload();
            });
          }
        });
      }
    });
  }

  /* ***************************************************************************************************** 
   * PLANTILLA CARGAR SOLO DETALLES
   * *****************************************************************************************************/
  nameFileDetalle: string;
  archivoSubidoDetalle: Array<File>;
  fileChangeDetalle(element) {
    this.archivoSubidoDetalle = element.target.files;
    this.nameFileDetalle = this.archivoSubidoDetalle[0].name;
    let arrayItems = this.nameFileDetalle.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 17);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'detalles horarios') {
        this.plantillaDetalle();
      } else {
        this.toastr.error('Solo se acepta', 'Plantilla seleccionada incorrecta', {
          timeOut: 6000,
        });
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada', {
        timeOut: 6000,
      });
    }
  }

  plantillaDetalle() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoDetalle.length; i++) {
      formData.append("uploads[]", this.archivoSubidoDetalle[i], this.archivoSubidoDetalle[i].name);
    }
    this.restD.VerificarDatosDetalles(formData).subscribe(res => {
      if (res.message === 'error') {
        this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla. ' +
          'Son datos obligatorios: nombre de horario, orden, hora y tipo de accion, además el nombre ' +
          'de horario debe existir dentro del sistema.', 'Operación Fallida', {
          timeOut: 6000,
        });
        this.archivo2Form.reset();
        this.nameFileDetalle = '';
      }
      else {
        this.restD.CargarPlantillaDetalles(formData).subscribe(res => {
          this.toastr.success('Operación Exitosa', 'Plantilla de Detalle de Horario importada.', {
            timeOut: 6000,
          });
          this.archivo2Form.reset();
          this.nameFileDetalle = '';
        });
      }
    });
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A PDF 
   ******************************************************************************************************/

  generarPdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinicion();

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion() {
    sessionStorage.setItem('Empleados', this.horarios);
    return {

      // Encabezado de página
      pageOrientation: 'landscape',
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
      footer: function (currentPage: any, pageCount: any, fecha: any, hora: any) {
        var f = moment();
        fecha = f.format('YYYY-MM-DD');

        var h = new Date();
        // Formato de hora actual
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
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
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: 'Lista de Horarios', bold: true, fontSize: 20, alignment: 'center', margin: [0, -30, 0, 10] },
        this.presentarDataPDFEmpleados(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableC: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  presentarDataPDFEmpleados() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [30, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Minutos de almuerzo', style: 'tableHeader' },
                { text: 'Horas de trabajo', style: 'tableHeader' },
                { text: 'Horario Flexibe', style: 'tableHeader' },
                { text: 'Horario por horas', style: 'tableHeader' },
                { text: 'Documento', style: 'tableHeader' },
              ],
              ...this.horarios.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.min_almuerzo, style: 'itemsTableC' },
                  { text: obj.hora_trabajo, style: 'itemsTableC' },
                  { text: obj.flexible, style: 'itemsTableC' },
                  { text: obj.por_horas, style: 'itemsTableC' },
                  { text: obj.doc_nombre, style: 'itemsTableC' },
                ];
              })
            ]
          },
          // ESTILO DE COLORES FORMATO ZEBRA
          layout: {
            fillColor: function (i: any) {
              return (i % 2 === 0) ? '#CCD1D1' : null;
            }
          }
        },
        { width: '*', text: '' },
      ]
    };
  }


  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A EXCEL 
   ******************************************************************************************************/

  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.horarios);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'horarios');
    xlsx.writeFile(wb, "CatHorariosEXCEL" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.horarios);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "CatHorarioCSV" + new Date().getTime() + '.csv');
  }

  /* ****************************************************************************************************
*                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
* ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloHorarios = [];
    this.horarios.forEach(obj => {
      objeto = {
        "horario": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "min_almuerzo": obj.min_almuerzo,
          "hora_trabajo": obj.hora_trabajo,
          "flexible": obj.flexible,
          "por_horas": obj.por_horas,
          "doc_nombre": obj.doc_nombre,
          "documento": obj.documento,
        }
      }
      arregloHorarios.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloHorarios).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = `${environment.url}/horario/download/` + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

}
