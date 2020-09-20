import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';


import { RegistroRolComponent } from 'src/app/componentes/catalogos/catRoles/registro-rol/registro-rol.component';
import { EditarRolComponent } from 'src/app/componentes/catalogos/catRoles/editar-rol/editar-rol.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { ScriptService } from 'src/app/servicios/empleado/script.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

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

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];
  logo: any;
  urlImagen: any;

  buscarDescripcion = new FormControl('', Validators.minLength(2));

  constructor(
    private rest: RolesService,
    private restE: EmpleadoService,
    public restEmpre: EmpresaService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
    private scriptService: ScriptService,
    private router: Router,
  ) {
    this.obtenerRoles();
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit() {
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerLogo();
  }

  // Método para obtener el logo de la empresa
  logoE: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logoE = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
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
    this.roles = [];
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
    this.vistaRegistrarDatos.open(EditarRolComponent, { width: '400px', data: { datosRol: datosSeleccionados, actualizar: true } }).afterClosed().subscribe(items => {
      if (items == true) {
        this.obtenerRoles();
      }
    });
  }

  AbrirVentanaRegistrarRol() {
    this.vistaRegistrarDatos.open(RegistroRolComponent, { width: '400px' }).afterClosed().subscribe(items => {
      if (items == true) {
        this.obtenerRoles();
      }
    });
  }

  limpiarCampoBuscar() {
    this.buscarDescripcion.reset();
  }

  /** Función para eliminar registro seleccionado */
  Eliminar(id_rol: number) {
    this.rest.EliminarRoles(id_rol).subscribe(res => {
      this.toastr.error('Registro eliminado');
      this.obtenerRoles();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos: any) {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/roles']);
        }
      });
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

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por: ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de la página
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
         // Formato de hora actual
        if (f.getMinutes() < 10) {
          var time = f.getHours() + ':0' + f.getMinutes();
        }
        else {
          var time = f.getHours() + ':' + f.getMinutes();
        }
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha + ' Hora: ' + time, ,
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', color: 'blue', opacity: 0.5
                }
              ],
            }
          ], fontSize: 10, color: '#A4B8FF',
        }
      },
      content: [
        { image: this.logoE, width: 150 },
        { text: 'Lista de Roles del Sistema', bold: true, fontSize: 20, alignment: 'center', margin: [0, 0, 0, 20] },
        this.presentarDataPDFRoles(),
      ],
      styles: {
        tableHeader: { fontSize: 13, bold: true, alignment: 'center', fillColor: '#6495ED' },
        itemsTable: { fontSize: 11, alignment: 'center' }
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
      this.urlxml = 'http://localhost:3000/rol/download/' + this.data.name;
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
