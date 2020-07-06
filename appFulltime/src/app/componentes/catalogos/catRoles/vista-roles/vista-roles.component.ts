import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { RegistroRolComponent } from 'src/app/componentes/catalogos/catRoles/registro-rol/registro-rol.component';
import { EditarRolComponent } from 'src/app/componentes/catalogos/catRoles/editar-rol/editar-rol.component';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { ScriptService } from 'src/app/servicios/empleado/script.service';

@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css'],
})
export class VistaRolesComponent implements OnInit {

  roles: any = [];
  filtroRoles = '';

  empleado: any = [];
  idEmpleado: number;
  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];
  logo: any;
  urlImagen: any;
  

  buscarDescripcion = new FormControl('', Validators.minLength(2));

  constructor(
    private rest: RolesService,
    private restE: EmpleadoService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
    private scriptService: ScriptService
  ) {
    this.obtenerRoles();
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit() {
    this.ObtenerEmpleados(this.idEmpleado);
    
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
      //this.urlImagen = 'http://localhost:3000/empleado/img/' + this.empleado[0]['imagen'];
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

  obtenerRoles() {
    this.rest.getRoles().subscribe(res => {
      this.roles = res;
    },
      err => console.error(err)
    );
  }

  /*****************************************************************************
   * VENTANA PARA REGISTRAR Y EDITAR DATOS
   *****************************************************************************/

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarRolComponent, { width: '400px', data: { datosRol: datosSeleccionados, actualizar: true } }).disableClose = true;
  }

  AbrirVentanaRegistrarRol() {
    this.vistaRegistrarDatos.open(RegistroRolComponent, { width: '400px' }).disableClose = true;
  }

  limpiarCampoBuscar() {
    this.buscarDescripcion.reset();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

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
    sessionStorage.setItem('Roles', this.roles);
    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: {text:'Usuario: ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize:9, opacity: 0.3 },

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
          text: 'ROLES DEL SISTEMA',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        this.presentarDataPDFRoles(),
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
          fontSize: 13,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 11,
          alignment: 'center'
        }
      }
    };
  }

  presentarDataPDFRoles() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [50, 150],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
              ],
              ...this.roles.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTable' },
                  { text: obj.nombre, style: 'itemsTable' },
                ];
              })
            ],
          },
        },
        { width: '*', text: '' },
      ]
    };
  }


  /*logoEmplesa() {
    this.getBase64();
    if (this.logo) {
      return {
        image: this.logo,
        width: 110,
        alignment: 'right'
      };
    }
    return null;
  }

  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64();
  }

  getBase64() {
    const reader = new FileReader();
    reader.readAsDataURL(this.urlImagen);
    reader.onload = () => {
      // console.log(reader.result);
      this.logo = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }*/

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL
   * ****************************************************************************************************/

  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.roles);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'roles');
    xlsx.writeFile(wb, "RolesEXCEL" + new Date().getTime() + '.xlsx');
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloRoles = [];
    this.roles.forEach(obj => {
      objeto = {
        "rol": {
          '@id': obj.id,
          "nombre": obj.nombre,
        }
      }
      arregloRoles.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloRoles).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://192.168.0.192:3001/rol/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.roles);
    const csvDataC = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "RolesCSV" + new Date().getTime() + '.csv');
  }
}
