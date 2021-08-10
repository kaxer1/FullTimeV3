// IMPORTACIÓN DE LIBRERIAS
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import * as xlsx from 'xlsx';

// IMPORTAR COMPONENTES
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';
import { EditarTitulosComponent } from '../editar-titulos/editar-titulos.component'
import { TitulosComponent } from '../titulos/titulos.component'

// IMPORTAR SERVICIOS
import { PlantillaReportesService } from 'src/app/componentes/reportes/plantilla-reportes.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { NivelTitulosService } from 'src/app/servicios/nivelTitulos/nivel-titulos.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';

@Component({
  selector: 'app-listar-titulos',
  templateUrl: './listar-titulos.component.html',
  styleUrls: ['./listar-titulos.component.css']
})

export class ListarTitulosComponent implements OnInit {

  // VARIABLES USADAS PARA ALMACENAMIENTO DE DATOS
  verTitulos: any = [];
  empleado: any = [];

  // VARIABLES USADAS PARA FILTROS DE BÚSQUEDA
  filtradoNombre = '';
  filtradoNivel = '';

  idEmpleado: number; // VARIABLE QUE ALMACENA ID DE EMPLEADO QUE INICIO SESIÓN

  // CONTROL DE CAMPOS Y VALIDACIONES DEL FORMULARIO
  nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  nivelF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);

  // ASIGNACIÓN DE VALIDACIONES A INPUTS DEL FORMULARIO
  public BuscarTitulosForm = new FormGroup({
    nombreForm: this.nombreF,
    nivelForm: this.nivelF,
  });

  // ITEMS DE PAGINACION DE LA TABLA
  pageSizeOptions = [5, 10, 20, 50];
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;

  // MÉTODO DE LLAMADO DE DATOS DE EMPRESA COLORES - LOGO - MARCA DE AGUA
  get s_color(): string { return this.plantillaPDF.color_Secundary }
  get p_color(): string { return this.plantillaPDF.color_Primary }
  get frase(): string { return this.plantillaPDF.marca_Agua }
  get logo(): string { return this.plantillaPDF.logoBase64 }

  constructor(
    private plantillaPDF: PlantillaReportesService, // SERVICIO DATOS DE EMPRESA
    public vistaRegistrarDatos: MatDialog, // VARIABLE QUE MANEJA EVENTOS CON VENTANAS
    public restN: NivelTitulosService, // SERVICIO DATOS NIVEL DE TÍTULO
    public restE: EmpleadoService, // SERVICIO DATOS DE EMPLEADO
    private toastr: ToastrService, // VARIABLE DE MANEJO DE MENSAJES DE NOTIFICACIONES
    public rest: TituloService, // SERVICIO DATOS DE TITULOS
    public router: Router, // VARIABLE USADA PARA MANEJO DE PÁGINAS CON URL
  ) { }

  ngOnInit(): void {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerTitulos();
  }

  // EVENTO PARA MOSTRAR NÚMERO DE FILAS DETERMINADAS EN LA TABLA
  ManejarPagina(e: PageEvent) {
    this.numero_pagina = e.pageIndex + 1;
    this.tamanio_pagina = e.pageSize;
  }

  // MÉTODO PARA VER LA INFORMACIÓN DEL EMPLEADO 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  ObtenerTitulos() {
    this.rest.getTituloRest().subscribe(data => {
      this.verTitulos = data;
    });
  }

  // ORDENAR LOS DATOS SEGÚN EL ID 
  OrdenarDatos(array: any) {
    function compare(a: any, b: any) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    }
    array.sort(compare);
  }

  AbrirVentanaRegistrarTitulo(): void {
    this.vistaRegistrarDatos.open(TitulosComponent, { width: '400px' }).afterClosed().subscribe(items => {
      this.ObtenerTitulos();
    });
  }

  LimpiarCampos() {
    this.BuscarTitulosForm.setValue({
      nombreForm: '',
      nivelForm: ''
    });
    this.ObtenerTitulos();
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombreF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeErrorNivel() {
    if (this.nivelF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    // SE DEFINE TODO EL ABECEDARIO QUE SE VA A USAR.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    // ES LA VALIDACIÓN DEL KEYCODES, QUE TECLAS RECIBE EL CAMPO DE TEXTO.
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

  AbrirVentanaEditarTitulo(datosSeleccionados: any): void {
    this.vistaRegistrarDatos.open(EditarTitulosComponent, { width: '400px', data: datosSeleccionados }).afterClosed().subscribe(items => {
      this.ObtenerTitulos();
    });
  }

  // FUNCIÓN PARA ELIMINAR REGISTRO SELECCIONADO 
  Eliminar(id_titulo: number) {
    this.rest.EliminarRegistro(id_titulo).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.ObtenerTitulos();
    });
  }

  // FUNCIÓN PARA CONFIRMAR SI SE ELIMINA O NO UN REGISTRO 
  ConfirmarDelete(datos: any) {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/titulos']);
        }
      });
  }


  /* ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
  * ****************************************************************************************************/

  GenerarPdf(action = 'open') {
    this.OrdenarDatos(this.verTitulos);
    const documentDefinition = this.GetDocumentDefinicion();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
    this.ObtenerTitulos();
  }

  GetDocumentDefinicion() {
    sessionStorage.setItem('Títulos', this.verTitulos);
    return {
      // ENCABEZADO DE LA PÁGINA
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // PIE DE LA PÁGINA
      footer: function (currentPage: any, pageCount: any, fecha: any, hora: any) {
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        hora = f.format('HH:mm:ss');
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + hora, opacity: 0.3 },
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
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: 'Lista de Títulos', bold: true, fontSize: 20, alignment: 'center', margin: [0, -10, 0, 10] },
        this.PresentarDataPDF(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableD: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  PresentarDataPDF() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Nivel', style: 'tableHeader' },
              ],
              ...this.verTitulos.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableD' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.nivel, style: 'itemsTableD' }
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

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL
   * ****************************************************************************************************/

  ExportToExcel() {
    this.OrdenarDatos(this.verTitulos);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.verTitulos.map(obj => {
      return {
        CODIGO: obj.id,
        TITULO: obj.nombre,
        NIVEL: obj.nivel
      }
    }));
    // MÉTODO PARA DEFINIR TAMAÑO DE LAS COLUMNAS DEL REPORTE
    const header = Object.keys(this.verTitulos[0]); // NOMBRE DE CABECERAS DE COLUMNAS
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // CABECERAS AÑADIDAS CON ESPACIOS
      wscols.push({ wpx: 100 })
    }
    wst["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wst, 'LISTAR TITULOS');
    xlsx.writeFile(wb, "TitulosEXCEL" + new Date().getTime() + '.xlsx');
    this.ObtenerTitulos();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/
  urlxml: string;
  data: any = [];
  ExportToXML() {
    this.OrdenarDatos(this.verTitulos);
    var objeto: any;
    var arregloTitulos = [];
    this.verTitulos.forEach(obj => {
      objeto = {
        "titulos": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "nivel": obj.nivel,
        }
      }
      arregloTitulos.push(objeto)
    });
    this.rest.DownloadXMLRest(arregloTitulos).subscribe(res => {
      this.data = res;
      this.urlxml = `${environment.url}/titulo/download/` + this.data.name;
      window.open(this.urlxml, "_blank");
    });
    this.ObtenerTitulos();
  }

  /* ***************************************************************************************************** 
   *                                  MÉTODO PARA EXPORTAR A CSV 
   * *****************************************************************************************************/

  ExportToCVS() {
    this.OrdenarDatos(this.verTitulos);
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.verTitulos);
    const csvDataC = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "TitulosCSV" + new Date().getTime() + '.csv');
    this.ObtenerTitulos();
  }

}
