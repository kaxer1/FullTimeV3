import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { RegistroEmpresaComponent } from 'src/app/componentes/catalogos/catEmpresa/registro-empresa/registro-empresa.component';
import { EditarEmpresaComponent } from 'src/app/componentes/catalogos/catEmpresa/editar-empresa/editar-empresa.component';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.css']
})
export class ListarEmpresasComponent implements OnInit {

  buscarNombre = new FormControl('', [Validators.minLength(2)]);
  buscarRuc = new FormControl('', [Validators.minLength(2)]);
  filtroNomEmpresa = '';
  filtroRucEmpresa = '';

  public BuscarEmpresaForm = new FormGroup({
    buscarNombreForm: this.buscarNombre,
    buscarRucForm: this.buscarRuc
  });

  empresas: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleado: any = [];
  idEmpleado: number;

  constructor(
    private rest: EmpresaService,
    public restE: EmpleadoService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) { 
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpresa();
    this.ObtenerEmpleados(this.idEmpleado);
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
      //this.urlImagen = 'http://localhost:3000/empleado/img/' + this.empleado[0]['imagen'];
    })
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerEmpresa() {
    this.rest.ConsultarEmpresas().subscribe(data => {
      this.empresas = data;
    });
  }

  AbrirVentanaRegistrarEmpresa() {
    this.vistaRegistrarDatos.open(RegistroEmpresaComponent, { width: '600px' }).afterClosed().subscribe(item => {
      this.ObtenerEmpresa();
    });
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarEmpresaComponent, { width: '600px', data: datosSeleccionados }).afterClosed().subscribe(item => {
      this.ObtenerEmpresa();
    });
    //console.log(datosSeleccionados.fecha);
  }

  LimpiarCampoBuscar() {
    this.BuscarEmpresaForm.setValue({
      buscarNombreForm: '',
      buscarRucForm: ''
    });
    this.ObtenerEmpresa();
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
    sessionStorage.setItem('Empresas', this.empresas);

    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

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
            'Fecha: ' + fecha + ' Hora: ' + time,,
            {
              text: [
                {
                  text: '© Pag '  + currentPage.toString() + ' of ' + pageCount,
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
        {
          text: 'Lista de Empresas',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        this.presentarDataPDFEmpresas(),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
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
          fontSize: 12,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 10
        },
        itemsTableC: {
          fontSize: 10,
          alignment: 'center'
        },
      }
    };
  }

  presentarDataPDFEmpresas() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [30, 'auto', 'auto', '*', '*', 'auto', 'auto', '*'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'RUC', style: 'tableHeader' },
                { text: 'Dirección', style: 'tableHeader' },
                { text: 'Teléfono', style: 'tableHeader' },
                { text: 'Correo', style: 'tableHeader' },
                { text: 'Tipo de Empresa', style: 'tableHeader' },
                { text: 'Representante', style: 'tableHeader' }
              ],
              ...this.empresas.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableC' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.ruc, style: 'itemsTableC' },
                  { text: obj.direccion, style: 'itemsTable' },
                  { text: obj.telefono, style: 'itemsTableC' },
                  { text: obj.correo, style: 'itemsTable' },
                  { text: obj.tipo_empresa, style: 'itemsTable' },
                  { text: obj.representante, style: 'itemsTable' },
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
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empresas);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'Empresas');
    xlsx.writeFile(wb, "Empresas" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   *                                        MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empresas);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpresasCSV" + new Date().getTime() + '.csv');
  }

  /* ****************************************************************************************************
 *                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
 * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloEmpresas = [];
    this.empresas.forEach(obj => {
      objeto = {
        "empresa": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "ruc": obj.ruc,
          "direccion": obj.direccion,
          "telefono": obj.telefono,
          "correo": obj.correo,
          "tipo_empresa": obj.tipo_empresa,
          "representante": obj.representante,
        }
      }
      arregloEmpresas.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloEmpresas).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://192.168.0.192:3001/empresas/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

}
