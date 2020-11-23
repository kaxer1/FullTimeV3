import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { RegistroProcesoComponent } from '../registro-proceso/registro-proceso.component';
import { EditarCatProcesosComponent } from 'src/app/componentes/catalogos/catProcesos/editar-cat-procesos/editar-cat-procesos.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-principal-proceso',
  templateUrl: './principal-proceso.component.html',
  styleUrls: ['./principal-proceso.component.css']
})

export class PrincipalProcesoComponent implements OnInit {

  buscarNombre = new FormControl('', [Validators.minLength(2)]);
  buscarNivel = new FormControl('');
  buscarPadre = new FormControl('', [Validators.minLength(2)]);

  procesos: any = [];
  auxiliar1: any = [];
  auxiliar2: any = [];

  filtroNombre = '';
  filtroNivel: number;
  filtroProPadre = '';

  empleado: any = [];
  idEmpleado: number;

  constructor(
    private rest: ProcesoService,
    public restE: EmpleadoService,
    private toastr: ToastrService,
    public restEmpre: EmpresaService,
    public vistaRegistrarDatos: MatDialog,
    private router: Router,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  ngOnInit(): void {
    this.getProcesos();
    this.ObtenerEmpleados(this.idEmpleado);
       this.ObtenerLogo();
    this.ObtnerColores();
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

  // Método para obtener colores de empresa
  p_color: any;
  s_color: any;
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
      return false;
    }
  }

  limpiarCampoBuscar() {
    this.buscarNombre.reset();
    this.buscarNivel.reset();
    this.buscarPadre.reset();
  }

  getProcesos() {
    this.procesos = [];
    this.rest.getProcesosRest().subscribe(data => {
      this.procesos = data;
    });
  }

  getOneProceso(id: number) {
    this.rest.getOneProcesoRest(id).subscribe(data => {
      this.procesos = data;
    })
  }

  postProvincia(form) {
    let dataProvincia = {
      nombre: form.nombre
    };

    this.rest.postProcesoRest(dataProvincia).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  AbrirVentanaRegistrarProceso() {
    this.vistaRegistrarDatos.open(RegistroProcesoComponent, { width: '450px' }).afterClosed().subscribe(items => {
      this.getProcesos();
    });
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarCatProcesosComponent, { width: '450px', data: { datosP: datosSeleccionados, lista: true } }).disableClose = true;
    //console.log(datosSeleccionados.fecha);
  }

  /** Función para eliminar registro seleccionado */
  Eliminar(id_proceso: number) {
    this.rest.deleteProcesoRest(id_proceso).subscribe(res => {
      this.toastr.error('Registro eliminado','', {
        timeOut: 6000,
      });
      this.getProcesos();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/proceso']);
        }
      });
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

  /****************************************************************************************************** 
   *                                         MÉTODO PARA EXPORTAR A PDF
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
    sessionStorage.setItem('Procesos', this.procesos);
    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de la página
      footer: function (currentPage, pageCount, fecha) {
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
        { text: 'Lista de Procesos', bold: true, fontSize: 20, alignment: 'center', margin: [0, -30, 0, 10] },
        this.presentarDataPDFProcesos(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10 },
        itemsTableC: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  presentarDataPDFProcesos() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [30, 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Nivel', style: 'tableHeader' },
                { text: 'Proceso Superior', style: 'tableHeader' },
              ],
              ...this.procesos.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.nivel, style: 'itemsTableC' },
                  { text: obj.proc_padre, style: 'itemsTable' },
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
    };
  }

  /****************************************************************************************************** 
   *                                       MÉTODO PARA EXPORTAR A EXCEL
   ******************************************************************************************************/
  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.procesos);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'Procesos');
    xlsx.writeFile(wb, "Procesos" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   *                                        MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.procesos);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "ProcesosCSV" + new Date().getTime() + '.csv');
  }

  /* ****************************************************************************************************
   *                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloProcesos = [];
    this.procesos.forEach(obj => {
      objeto = {
        "proceso": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "nivel": obj.nivel,
          "proceso_superior": obj.proc_padre,
        }
      }
      arregloProcesos.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloProcesos).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://localhost:3000/proceso/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }
}