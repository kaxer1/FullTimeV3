// IMPORTACIÓN DE LIBRERIAS
import { environment } from 'src/environments/environment';
import { FormControl, Validators } from '@angular/forms';
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

// IMPORTACION DE COMPONENTES
import { RegistroRolComponent } from 'src/app/componentes/catalogos/catRoles/registro-rol/registro-rol.component';
import { EditarRolComponent } from 'src/app/componentes/catalogos/catRoles/editar-rol/editar-rol.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

// IMPORTACIÓN DE SERVICIOS
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';

@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css'],
})

export class VistaRolesComponent implements OnInit {

  empleado: any = []; // VARIABLE DE ALMACENAMIENTO DE DATOS DE EMPLEADO
  idEmpleado: number; // VARIABLE DE ID DE EMPLEADO QUE INICIA SESIÓN
  filtroRoles = ''; // VARIABLE DE BÚSQUEDA DE DATOS
  roles: any = []; // VARIABLE DE ALMACENAMIENTO DE DATOS DE ROLES

  // ITEMS DE PAGINACIÓN DE LA TABLA
  pageSizeOptions = [5, 10, 20, 50];
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;

  // CAMPO DE BÚSQUEDA DE DATOS
  buscarDescripcion = new FormControl('', Validators.minLength(2));

  constructor(
    public vistaRegistrarDatos: MatDialog,
    public restEmpre: EmpresaService,
    private restE: EmpleadoService,
    private toastr: ToastrService,
    private rest: RolesService,
    private router: Router,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit() {
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerColores();
    this.ObtenerRoles();
    this.ObtenerLogo();
  }

  // MÉTODO PARA OBTENER EL LOGO DE LA EMPRESA
  logoE: any = String; // VARIABLE DE ALMACENAMIENTO DE IMAGEN LOGO DE LA EMPRESA
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logoE = 'data:image/jpeg;base64,' + res.imagen;
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

  // MÉTODO PARA MOSTRAR FILAS DETERMINADAS DE DATOS EN LA TABLA
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

  // MÉTODO PARA INGRESAR SOLO LETRAS
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

  ObtenerRoles() {
    this.roles = [];
    this.rest.getRoles().subscribe(res => {
      this.roles = res;
    });
  }

  /* **************************************************************************** *
   *                     VENTANA PARA REGISTRAR Y EDITAR DATOS
   * **************************************************************************** *
   * */

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarRolComponent, { width: '400px', data: { datosRol: datosSeleccionados, actualizar: true } }).afterClosed().subscribe(items => {
      if (items == true) {
        this.ObtenerRoles();
      }
    });
  }

  AbrirVentanaRegistrarRol() {
    this.vistaRegistrarDatos.open(RegistroRolComponent, { width: '400px' }).afterClosed().subscribe(items => {
      if (items == true) {
        this.ObtenerRoles();
      }
    });
  }

  // MÉTODO PARA LIMPIAR CAMPOS DE BÚSQUEDA
  LimpiarCampoBuscar() {
    this.buscarDescripcion.reset();
  }


  // FUNCIÓN PARA ELIMINAR REGISTRO SELECCIONADO 
  Eliminar(id_rol: number) {
    this.rest.EliminarRoles(id_rol).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.ObtenerRoles();
    });
  }

  // FUNCIÓN PARA CONFIRMAR SI SE ELIMINA O NO UN REGISTRO 
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

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

  GenerarPdf(action = 'open') {
    this.OrdenarDatos(this.roles);
    const documentDefinition = this.GetDocumentDefinicion();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
    this.ObtenerRoles();
  }

  GetDocumentDefinicion() {
    sessionStorage.setItem('Roles', this.roles);
    return {
      // ENCABEZADO DE LA PÁGINA
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por: ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
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
          ], fontSize: 10
        }
      },
      content: [
        { image: this.logoE, width: 150, margin: [10, -25, 0, 5] },
        { text: 'Roles del Sistema', bold: true, fontSize: 16, alignment: 'center', margin: [0, -10, 0, 10] },
        this.PresentarDataPDFRoles(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  PresentarDataPDFRoles() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [50, 150],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
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
    this.OrdenarDatos(this.roles);
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.roles.map(obj => {
      return {
        CODIGO: obj.id,
        NOMBRE_ROL: obj.nombre
      }
    }));
    // MÉTODO PARA DEFINIR TAMAÑO DE LAS COLUMNAS DEL REPORTE
    const header = Object.keys(this.roles[0]); // NOMBRE DE CABECERAS DE COLUMNAS
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // CABECERAS AÑADIDAS CON ESPACIOS
      wscols.push({ wpx: 100 })
    }
    wsr["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'LISTA ROLES');
    xlsx.writeFile(wb, "RolesEXCEL" + new Date().getTime() + '.xlsx');
    this.ObtenerRoles();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  ExportToXML() {
    this.OrdenarDatos(this.roles);
    var objeto: any;
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
      this.urlxml = `${environment.url}/rol/download/` + this.data.name;
      window.open(this.urlxml, "_blank");
    });
    this.ObtenerRoles();
  }

  /* ***************************************************************************************************** 
   *                                       MÉTODO PARA EXPORTAR A CSV 
   * *****************************************************************************************************/

  ExportToCVS() {
    this.OrdenarDatos(this.roles);
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.roles);
    const csvDataC = xlsx.utils.sheet_to_csv(wsr);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "RolesCSV" + new Date().getTime() + '.csv');
    this.ObtenerRoles();
  }
}
