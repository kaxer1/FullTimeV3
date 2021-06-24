// IMPORTACIÓN DE LIBRERIAS
import { environment } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { Validators, FormControl } from '@angular/forms';
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
import { ConfirmarDesactivadosComponent } from './confirmar-desactivados/confirmar-desactivados.component';

// IMPORTAR SERVICIOS
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { EmpleadoElemento } from '../../../model/empleado.model'

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})

export class ListaEmpleadosComponent implements OnInit {

  // VARIABLES DE ALMACENAMIENTO DE DATOS 
  nacionalidades: any = [];
  empleadoD: any = [];
  empleado: any = [];

  // CAMPOS DEL FORMULARIO
  codigo = new FormControl('');
  apellido = new FormControl('', [Validators.minLength(2)]);
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);

  // VARIABLES USADAS EN BÚSQUEDA DE FILTRO DE DATOS
  filtroCodigo: number;
  filtroApellido: '';
  filtroCedula: '';
  filtroNombre: '';

  // ITEMS DE PAGINACIÓN DE LA TABLA
  pageSizeOptions = [5, 10, 20, 50];
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;

  // ITEMS DE PAGINACIÓN DE LA TABLA DESHABILITADOS
  pageSizeOptionsDes = [5, 10, 20, 50];
  tamanio_paginaDes: number = 5;
  numero_paginaDes: number = 1;

  idEmpleado: number; // VARIABLE DE ALMACENAMIENTO DE ID DE EMPLEADO QUE INICIA SESIÓN

  // VARAIBLES DE SELECCIÓN DE DATOS DE UNA TABLA
  selectionUno = new SelectionModel<EmpleadoElemento>(true, []);
  selectionDos = new SelectionModel<EmpleadoElemento>(true, []);

  constructor(
    public vistaRegistrarDatos: MatDialog, // VARIABLE MANEJO DE VENTANAS DE DIÁLOGO
    public restEmpre: EmpresaService, // SERVICIO DATOS DE EMPRESA
    private toastr: ToastrService, // VARIABLE DE MANEJO DE MENSAJES DE NOTIFICACIONES
    public rest: EmpleadoService, // SERVICIO DATOS DE EMPLEADO
    public router: Router, // VARIABLE DE USO DE PÁGINAS CON URL
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerNacionalidades();
    this.DescargarPlantilla();
    this.ObtenerColores();
    this.GetEmpleados();
    this.ObtenerLogo();
  }

  // SI EL NÚMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NÚMERO TOTAL DE FILAS. 
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.empleado.length;
    return numSelected === numRows;
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTÁN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCIÓN CLARA. 
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.empleado.forEach(row => this.selectionUno.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACIÓN EN LA FILA PASADA
  checkboxLabel(row?: EmpleadoElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUno.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // MÉTODO PARA DESACTIVAR O ACTIVAR CHECK LIST DE EMPLEADOS ACTIVOS
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

  // MÉTODO PARA ACTIVAR O DESACTIVAR CHECK LIST DE TABLA EMPLEADOS DESACTIVADOS
  Hab_Deshabilitados: boolean = false;
  btnCheckDeshabilitado: boolean = false;
  HabilitarSeleccionDesactivados() {
    if (this.btnCheckDeshabilitado === false) {
      this.btnCheckDeshabilitado = true;
    } else if (this.btnCheckDeshabilitado === true) {
      this.btnCheckDeshabilitado = false;
    }
  }

  // SI EL NÚMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NÚMERO TOTAL DE FILAS.
  isAllSelectedDos() {
    const numSelected = this.selectionDos.selected.length;
    const numRows = this.desactivados.length;
    return numSelected === numRows;
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTÁN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCIÓN CLARA. 
  masterToggleDos() {
    this.isAllSelectedDos() ?
      this.selectionDos.clear() :
      this.desactivados.forEach(row => this.selectionDos.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACIÓN EN LA FILA PASADA
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
    this.vistaRegistrarDatos.open(ConfirmarDesactivadosComponent, { width: '500px', data: { opcion: opcion, lista: EmpleadosSeleccionados } }).afterClosed().subscribe(item => {
      if (item === true) {
        this.GetEmpleados();
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

  // MÉTODO PARA VER LA INFORMACIÓN DEL EMPLEADO 
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
    this.numero_pagina = e.pageIndex + 1;
    this.tamanio_pagina = e.pageSize;
  }

  ManejarPaginaDes(e: PageEvent) {
    this.numero_paginaDes = e.pageIndex + 1;
    this.tamanio_paginaDes = e.pageSize;
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

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // COMPROBAMOS SI SE ENCUENTRA EN EL RANGO NUMÉRICO Y QUE TECLAS NO RECIBIRÁ.
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

  GetEmpleados() {
    this.empleado = [];
    this.rest.getEmpleadosRest().subscribe(data => {
      this.empleado = data;
      this.OrdenarDatos(this.empleado);
      console.log('datos empleado', this.empleado);
    })
  }

  // ORDENAR LOS DATOS SEGÚN EL  CODIGO
  OrdenarDatos(array: any) {
    function compare(a: any, b: any) {
      if (parseInt(a.codigo) < parseInt(b.codigo)) {
        return -1;
      }
      if (parseInt(a.codigo) > parseInt(b.codigo)) {
        return 1;
      }
      return 0;
    }
    array.sort(compare);
  }

  LimpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
  }

  ObtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
  }

  /** *************************************************************************
   *                    Metodos y variables para subir plantilla              * 
   ** *************************************************************************/

  nameFile: string;
  archivoSubido: Array<File>;
  archivoForm = new FormControl('', Validators.required);
  FileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (this.datosCodigo[0].automatico === true) {
        var itemName = arrayItems[0].slice(0, 18);
        if (itemName.toLowerCase() == 'empleadoautomatico') {
          console.log('entra_automatico');
          this.VerificarPlantilla();
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
          this.VerificarPlantilla();
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

  VerificarPlantilla() {
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
        this.link = `${environment.url}/plantillaD/documento/EmpleadoAutomatico.xlsx`
      } else {
        this.link = `${environment.url}/plantillaD/documento/EmpleadoManual.xlsx`
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

  GenerarPdf(action = 'open', numero: any) {
    const documentDefinition = this.GetDocumentDefinicion(numero);
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  GetDocumentDefinicion(numero: any) {
    sessionStorage.setItem('Empleados', this.empleado);
    return {
      // ENCABEZADO DE LA PÁGINA
      pageOrientation: 'landscape',
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoD[0].nombre + ' ' + this.empleadoD[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
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
        { text: 'Lista de Empleados', bold: true, fontSize: 20, alignment: 'center', margin: [0, -20, 0, 10] },
        this.presentarDataPDFEmpleados(numero),
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 9 },
        itemsTableD: { fontSize: 9, alignment: 'center' }
      }
    };
  }

  EstadoCivilSelect: any = ['Soltero/a', 'Unión de Hecho', 'Casado/a', 'Divorciado/a', 'Viudo/a'];
  GeneroSelect: any = ['Masculino', 'Femenino'];
  EstadoSelect: any = ['Activo', 'Inactivo'];
  presentarDataPDFEmpleados(numero: any) {
    if (numero === 1) {
      var arreglo = this.empleado
    }
    else {
      arreglo = this.desactivados
    }
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
              ...arreglo.map(obj => {
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

  ExportToExcel(numero: any) {
    if (numero === 1) {
      var arreglo = this.empleado
    }
    else {
      arreglo = this.desactivados
    }
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(arreglo.map(obj => {
      let nacionalidad: any;
      this.nacionalidades.forEach(element => {
        if (obj.id_nacionalidad == element.id) {
          nacionalidad = element.nombre;
        }
      });
      return {
        CODIGO: obj.codigo,
        CEDULA: obj.cedula,
        APELLIDO: obj.apellido,
        NOMBRE: obj.nombre,
        FECHA_NACIMIENTO: obj.fec_nacimiento.split("T")[0],
        ESTADO_CIVIL: this.EstadoCivilSelect[obj.esta_civil - 1],
        GENERO: this.GeneroSelect[obj.genero - 1],
        CORREO: obj.correo,
        ESTADO: this.EstadoSelect[obj.estado - 1],
        CORREO_ALTERNATIVO: obj.mail_alternativo,
        DOMICILIO: obj.domicilio,
        TELEFONO: obj.telefono,
        NACIONALIDAD: nacionalidad,
      }
    }));
    // MÉTODO PARA DEFINIR TAMAÑO DE LAS COLUMNAS DEL REPORTE
    const header = Object.keys(arreglo[0]); // NOMBRE DE CABECERAS DE COLUMNAS
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // CABECERAS AÑADIDAS CON ESPACIOS
      wscols.push({ wpx: 100 })
    }
    wse["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'LISTA EMPLEADOS');
    xlsx.writeFile(wb, "EmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/
  urlxml: string;
  data: any = [];
  ExportToXML(numero: any) {
    if (numero === 1) {
      var arreglo = this.empleado
    }
    else {
      arreglo = this.desactivados
    }
    var objeto: any;
    var arregloEmpleado = [];
    arreglo.forEach(obj => {
      var estadoCivil = this.EstadoCivilSelect[obj.esta_civil - 1];
      var genero = this.GeneroSelect[obj.genero - 1];
      var estado = this.EstadoSelect[obj.estado - 1];
      let nacionalidad: any;
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
      this.urlxml = `${environment.url}/empleado/download/` + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

  /****************************************************************************************************** 
   *                                           MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  ExportToCVS(numero: any) {
    if (numero === 1) {
      var arreglo = this.empleado
    }
    else {
      arreglo = this.desactivados
    }
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(arreglo);
    const csvDataC = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpleadosCSV" + new Date().getTime() + '.csv');
  }

}
