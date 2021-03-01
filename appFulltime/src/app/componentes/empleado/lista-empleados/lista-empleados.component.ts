import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmarDesactivadosComponent } from './confirmar-desactivados/confirmar-desactivados.component';
import { EmpleadoElemento } from '../../../model/empleado.model'

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})

export class ListaEmpleadosComponent implements OnInit {

  empleado: any = [];
  nacionalidades: any = [];

  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  apellido = new FormControl('', [Validators.minLength(2)]);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombre: '';
  filtroApellido: '';

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Items de paginación de la tabla Deshabilitados
  tamanio_paginaDes: number = 5;
  numero_paginaDes: number = 1;
  pageSizeOptionsDes = [5, 10, 20, 50];

  empleadoD: any = [];
  idEmpleado: number;

  selectionUno = new SelectionModel<EmpleadoElemento>(true, []);
  selectionDos = new SelectionModel<EmpleadoElemento>(true, []);

  constructor(
    public rest: EmpleadoService,
    public restEmpre: EmpresaService,
    public router: Router,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.DescargarPlantilla();
    this.getEmpleados();
    this.obtenerNacionalidades();
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerLogo();
    this.ObtnerColores();
  }

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.empleado.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.empleado.forEach(row => this.selectionUno.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabel(row?: EmpleadoElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUno.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  btnCheckHabilitar: boolean = false;
  HabilitarSeleccion() {
    if (this.btnCheckHabilitar === false) {
      this.btnCheckHabilitar = true;
    } else if (this.btnCheckHabilitar === true) {
      this.btnCheckHabilitar = false;
    }
  }

  desactivados: any = [];
  ListaEmpleadosDeshabilitados() {
    this.desactivados = [];
    if (this.Hab_Deshabilitados == false) {
      this.Hab_Deshabilitados = true;
      this.rest.ListaEmpleadosDesactivados().subscribe(res => {
        this.desactivados = res;
      });
    } else if (this.Hab_Deshabilitados == true) {
      this.Hab_Deshabilitados = false;
    }
  }

  Hab_Deshabilitados: boolean = false;
  btnCheckDeshabilitado: boolean = false;
  HabilitarSeleccionDesactivados() {
    if (this.btnCheckDeshabilitado === false) {
      this.btnCheckDeshabilitado = true;
    } else if (this.btnCheckDeshabilitado === true) {
      this.btnCheckDeshabilitado = false;
    }
  }

  isAllSelectedDos() {
    const numSelected = this.selectionDos.selected.length;
    const numRows = this.desactivados.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleDos() {
    this.isAllSelectedDos() ?
      this.selectionDos.clear() :
      this.desactivados.forEach(row => this.selectionDos.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelDos(row?: EmpleadoElemento): string {
    if (!row) {
      return `${this.isAllSelectedDos() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionDos.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  Deshabilitar(opcion: number) {
    let EmpleadosSeleccionados
    if (opcion === 1) {
      EmpleadosSeleccionados = this.selectionUno.selected.map(obj => {
        return {
          id: obj.id,
          empleado: obj.nombre + ' ' + obj.apellido
        }
      })
    } else if (opcion === 2) {
      EmpleadosSeleccionados = this.selectionDos.selected.map(obj => {
        return {
          id: obj.id,
          empleado: obj.nombre + ' ' + obj.apellido
        }
      })
    } else if (opcion === 3) {
      EmpleadosSeleccionados = this.selectionDos.selected.map(obj => {
        return {
          id: obj.id,
          empleado: obj.nombre + ' ' + obj.apellido
        }
      })
    }
    console.log(EmpleadosSeleccionados);
    this.vistaRegistrarDatos.open(ConfirmarDesactivadosComponent, { width: '500px', data: { opcion: opcion, lista: EmpleadosSeleccionados } }).afterClosed().subscribe(item => {
      console.log(item);
      if (item === true) {
        this.getEmpleados();
        this.ListaEmpleadosDeshabilitados();
        this.btnCheckHabilitar = false;
        this.btnCheckDeshabilitado = false;
        this.Hab_Deshabilitados = false;
        this.selectionUno.clear();
        this.selectionDos.clear();
        EmpleadosSeleccionados = [];
      };
    });
  }


  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleadoD = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoD = data;
    })
  }

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
    console.log('empl ', this.empleado);
  }

  ManejarPaginaDes(e: PageEvent) {
    this.tamanio_paginaDes = e.pageSize;
    this.numero_paginaDes = e.pageIndex + 1;
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

  getEmpleados() {
    this.empleado = [];
    this.rest.getEmpleadosRest().subscribe(data => {
      this.empleado = data;
      console.log(this.empleado);
    })
  }

  limpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
  }

  obtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
  }

  /**
   * Metodos y variables para subir plantilla
   */

  nameFile: string;
  archivoSubido: Array<File>;
  archivoForm = new FormControl('', Validators.required);

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (this.datosCodigo[0].automatico === true) {
        var itemName = arrayItems[0].slice(0, 18);
        if (itemName.toLowerCase() == 'empleadoautomatico') {
          console.log('entra_automatico');
          this.plantilla();
        } else {
          this.toastr.error('Cargar la plantilla con nombre EmpleadoAutomatico', 'Plantilla seleccionada incorrecta', {
            timeOut: 6000,
          });
        }
      }
      else {
        itemName = arrayItems[0].slice(0, 14);
        if (itemName.toLowerCase() == 'empleadomanual') {
          console.log('entra_manual');
          this.plantilla();
        } else {
          this.toastr.error('Cargar la plantilla con nombre EmpleadoManual', 'Plantilla seleccionada incorrecta', {
            timeOut: 6000,
          });
          this.archivoForm.reset();
          this.nameFile = '';
        }
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada', {
        timeOut: 6000,
      });
      this.archivoForm.reset();
      this.nameFile = '';
    }
  }

  plantilla() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    if (this.datosCodigo[0].automatico === true) {
      this.ArchivoAutomatico(formData);
    }
    else {
      this.ArchivoManual(formData);
    }
  }

  ArchivoAutomatico(datosArchivo) {
    this.rest.verificarArchivoExcel_Automatico(datosArchivo).subscribe(res => {
      console.log('plantilla 1', res);
      if (res.message === "error") {
        this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla, ' +
          'recuerde que la cédula, código y nombre de usuario son datos únicos por ende no deben constar ' +
          'en otros registros. Asegurese de que el rol ingresado exista en el sistema.',
          'Registro Fallido. Verificar Plantilla', {
          timeOut: 6000,
        });
        this.archivoForm.reset();
        this.nameFile = '';
      } else {
        this.rest.verificarArchivoExcel_DatosAutomatico(datosArchivo).subscribe(response => {
          console.log('plantilla 2', response);
          if (response.message === "error") {
            this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla, ' +
              'recuerde que la cédula, código y nombre de usuario son datos únicos por ende no deben constar ' +
              'en otros registros. Asegurese de que el rol ingresado exista en el sistema.',
              'Registro Fallido. Verificar Plantilla', {
              timeOut: 6000,
            });
            this.archivoForm.reset();
            this.nameFile = '';
          } else {
            this.rest.subirArchivoExcel_Automatico(datosArchivo).subscribe(datos_archivo => {
              console.log('plantilla 3', datos_archivo);
              this.toastr.success('Operación Exitosa', 'Plantilla de Empleados importada.', {
                timeOut: 6000,
              });
              window.location.reload();
            });
          }
        });
      }
    });
  }

  ArchivoManual(datosArchivo) {
    this.rest.verificarArchivoExcel_Manual(datosArchivo).subscribe(res => {
      console.log('plantilla 1', res);
      if (res.message === "error") {
        this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla, ' +
          'recuerde que la cédula, código y nombre de usuario son datos únicos por ende no deben constar ' +
          'en otros registros. Asegurese de que el rol ingresado exista en el sistema.',
          'Registro Fallido. Verificar Plantilla', {
          timeOut: 6000,
        });
        this.archivoForm.reset();
        this.nameFile = '';
      } else {
        this.rest.verificarArchivoExcel_DatosManual(datosArchivo).subscribe(response => {
          console.log('plantilla 2', response);
          if (response.message === "error") {
            this.toastr.error('Para el buen funcionamiento del sistema verifique los datos de su plantilla, ' +
              'recuerde que la cédula, código y nombre de usuario son datos únicos por ende no deben constar ' +
              'en otros registros. Asegurese de que el rol ingresado exista en el sistema.',
              'Registro Fallido. Verificar Plantilla', {
              timeOut: 6000,
            });
            this.archivoForm.reset();
            this.nameFile = '';
          } else {
            this.rest.subirArchivoExcel_Manual(datosArchivo).subscribe(datos_archivo => {
              console.log('plantilla 3', datos_archivo);
              this.toastr.success('Operación Exitosa', 'Plantilla de Empleados importada.', {
                timeOut: 6000,
              });
              window.location.reload();
            });
          }
        });
      }
    });
  }

  link: string = null;
  datosCodigo: any = [];
  DescargarPlantilla() {
    this.datosCodigo = [];
    this.rest.ObtenerCodigo().subscribe(datos => {
      this.datosCodigo = datos;
      if (datos[0].automatico === true) {
        this.link = "http://localhost:3000/plantillaD/documento/EmpleadoAutomatico.xlsx"
      } else {
        this.link = "http://localhost:3000/plantillaD/documento/EmpleadoManual.xlsx"
      }
    }, error => {
      this.toastr.info('Para el correcto funcionamiento del sistema debe realizar la configuración del código de empleado', '', {
        timeOut: 6000,
      });
      this.router.navigate(['/codigo/']);
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
    sessionStorage.setItem('Empleados', this.empleado);
    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoD[0].nombre + ' ' + this.empleadoD[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de la página
      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
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
          ],
          fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: 'Lista de Empleados', bold: true, fontSize: 20, alignment: 'center', margin: [0, -30, 0, 10] },
        this.presentarDataPDFEmpleados(),
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8 },
        itemsTableD: { fontSize: 8, alignment: 'center' }
      }
    };
  }

  EstadoCivilSelect: any = ['Soltero/a', 'Unión de Hecho', 'Casado/a', 'Divorciado/a', 'Viudo/a'];
  GeneroSelect: any = ['Masculino', 'Femenino'];
  EstadoSelect: any = ['Activo', 'Inactivo'];
  presentarDataPDFEmpleados() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Apellido', style: 'tableHeader' },
                { text: 'Cedula', style: 'tableHeader' },
                { text: 'Fecha Nacimiento', style: 'tableHeader' },
                { text: 'Correo', style: 'tableHeader' },
                { text: 'Correo Alternativo', style: 'tableHeader' },
                { text: 'Género', style: 'tableHeader' },
                { text: 'Estado Civil', style: 'tableHeader' },
                { text: 'Domicilio', style: 'tableHeader' },
                { text: 'Teléfono', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' },
                { text: 'Nacionalidad', style: 'tableHeader' },
              ],
              ...this.empleado.map(obj => {
                var estadoCivil = this.EstadoCivilSelect[obj.esta_civil - 1];
                var genero = this.GeneroSelect[obj.genero - 1];
                var estado = this.EstadoSelect[obj.estado - 1];
                let nacionalidad;
                this.nacionalidades.forEach(element => {
                  if (obj.id_nacionalidad == element.id) {
                    nacionalidad = element.nombre;
                  }
                });
                return [
                  { text: obj.codigo, style: 'itemsTableD' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.apellido, style: 'itemsTable' },
                  { text: obj.cedula, style: 'itemsTableD' },
                  { text: obj.fec_nacimiento.split("T")[0], style: 'itemsTableD' },
                  { text: obj.correo, style: 'itemsTableD' },
                  { text: obj.mail_alternativo, style: 'itemsTableD' },
                  { text: genero, style: 'itemsTableD' },
                  { text: estadoCivil, style: 'itemsTableD' },
                  { text: obj.domicilio, style: 'itemsTableD' },
                  { text: obj.telefono, style: 'itemsTableD' },
                  { text: estado, style: 'itemsTableD' },
                  { text: nacionalidad, style: 'itemsTableD' }
                ];
              })
            ]
          }
        },
        { width: '*', text: '' },
      ]
    };
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL
   * ****************************************************************************************************/

  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleado);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'empleados');
    xlsx.writeFile(wb, "EmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/
  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloEmpleado = [];
    this.empleado.forEach(obj => {
      var estadoCivil = this.EstadoCivilSelect[obj.esta_civil - 1];
      var genero = this.GeneroSelect[obj.genero - 1];
      var estado = this.EstadoSelect[obj.estado - 1];
      let nacionalidad;
      this.nacionalidades.forEach(element => {
        if (obj.id_nacionalidad == element.id) {
          nacionalidad = element.nombre;
        }
      });

      objeto = {
        "empleado": {
          '@codigo': obj.codigo,
          "cedula": obj.cedula,
          "apellido": obj.apellido,
          "nombre": obj.nombre,
          "estadoCivil": estadoCivil,
          "genero": genero,
          "correo": obj.correo,
          "fechaNacimiento": obj.fec_nacimiento.split("T")[0],
          "estado": estado,
          "correoAlternativo": obj.mail_alternativo,
          "domicilio": obj.domicilio,
          "telefono": obj.telefono,
          "nacionalidad": nacionalidad,
          "imagen": obj.imagen
        }
      }
      arregloEmpleado.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloEmpleado).subscribe(res => {
      console.log(arregloEmpleado)
      this.data = res;
      console.log("prueba-empleado", res)
      this.urlxml = 'http://localhost:3000/empleado/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleado);
    const csvDataC = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpleadosCSV" + new Date().getTime() + '.csv');
  }

}
