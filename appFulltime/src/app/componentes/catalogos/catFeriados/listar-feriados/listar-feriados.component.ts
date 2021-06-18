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

// IMPORTACIÓN DE COMPONENTES
import { RegistrarFeriadosComponent } from 'src/app/componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';
import { EditarFeriadosComponent } from 'src/app/componentes/catalogos/catFeriados/editar-feriados/editar-feriados.component';
import { AsignarCiudadComponent } from 'src/app/componentes/catalogos/catFeriados/asignar-ciudad/asignar-ciudad.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

// IMPORTACIÓN DE SERVICIOS
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-listar-feriados',
  templateUrl: './listar-feriados.component.html',
  styleUrls: ['./listar-feriados.component.css'],
})

export class ListarFeriadosComponent implements OnInit {

  // CONTROL DE CAMPOS Y VALIDACIONES DEL FORMULARIO
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  archivoForm = new FormControl('', Validators.required);
  fechaF = new FormControl('');

  // ASIGNACIÓN DE VALIDACIONES A INPUTS DEL FORMULARIO
  public BuscarFeriadosForm = new FormGroup({
    descripcionForm: this.descripcionF,
    fechaForm: this.fechaF,
  });

  // ALMACENAMIENTO DE DATOS CONSULTADOS  
  feriados: any = [];
  empleado: any = [];

  // VARAIBLES USADAS PARA FILTROS DE BÚSQUEDA
  filtroDescripcion = '';
  filtradoFecha = '';

  idEmpleado: number; // VARIABLE DE ALMACENAMIENTO DE ID DE EMPLEADO QUE INICIA SESIÓN

  // ITEMS DE PAGINACIÓN DE LA TABLA
  pageSizeOptions = [5, 10, 20, 50];
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;

  // VARIABLES DE MANEJO DE PLANTILLA DE DATOS
  nameFile: string;
  archivoSubido: Array<File>;

  constructor(
    public restEmpre: EmpresaService, // SERVICIO DATOS DE EMPRESA
    private restE: EmpleadoService, // SERVICIO DATOS DE EMPLEADO
    private rest: FeriadosService, // SERVICIO DATOS DE FERIADOS
    private toastr: ToastrService, // VARIABLE MANEJO DE MENSAJES DE NOTIFICACIONES
    public ventana: MatDialog, // VARIABLE DE USO DE VENTANAS DE DIÁLOGO
    private router: Router, // VARIABLE DE USO DE NAVEGACIÓN ENTRE PÁGINA POR URL
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerFeriados();
    this.ObtenerColores();
    this.ObtenerLogo();
  }

  // MÉTODO PARA VER LA INFORMACIÓN DEL EMPLEADO 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  // MÉTODO PARA OBTENER EL LOGO DE LA EMPRESA
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

  // LECTURA DE DATOS
  ObtenerFeriados() {
    this.feriados = [];
    this.rest.ConsultarFeriado().subscribe(datos => {
      this.feriados = datos;
      for (let i = this.feriados.length - 1; i >= 0; i--) {
        var cadena1 = this.feriados[i]['fecha'];
        var aux1 = cadena1.split("T");
        this.feriados[i]['fecha'] = aux1[0];
        if (this.feriados[i]['fec_recuperacion'] != null) {
          var cadena2 = this.feriados[i]['fec_recuperacion'];
          var aux2 = cadena2.split("T");
          this.feriados[i]['fec_recuperacion'] = aux2[0];
        }
      }
    })
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

  AbrirVentanaRegistrarFeriado(): void {
    this.ventana.open(RegistrarFeriadosComponent, { width: '350px' }).afterClosed().subscribe(items => {
      if (items == true) {
        this.ObtenerFeriados();
      }
    });
  }

  AbrirVentanaEditarFeriado(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.ventana.open(EditarFeriadosComponent, { width: '350px', data: { datosFeriado: datosSeleccionados, actualizar: true } }).disableClose = true;
    console.log(datosSeleccionados.fecha);
  }

  AbrirVentanaAsignarCiudad(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.ventana.open(AsignarCiudadComponent, { width: '600px', data: { feriado: datosSeleccionados, actualizar: false } }).disableClose = true;
    console.log(datosSeleccionados.fecha);
  }

  // FUNCIÓN PARA ELIMINAR REGISTRO SELECCIONADO 
  Eliminar(id_feriado: number) {
    this.rest.EliminarFeriado(id_feriado).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.ObtenerFeriados();
    });
  }

  // FUNCIÓN PARA CONFIRMAR SI SE ELIMINA O NO UN REGISTRO 
  ConfirmarDelete(datos: any) {
    this.ventana.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/listarFeriados']);
        }
      });
  }

  LimpiarCampos() {
    this.BuscarFeriadosForm.setValue({
      descripcionForm: '',
      fechaForm: ''
    });
    this.ObtenerFeriados();
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

  ObtenerMensajeDescripcionLetras() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  // EVENTO PARA MOSTRAR FILAS DETERMINADAS EN LA TABLA
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  // MÉTODO PARA SELECCIONAR PLANTILLA DE DATOS DE FERIADOS
  FileChange(element: any) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 8);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'feriados') {
        this.Revisarplantilla();
      } else {
        this.toastr.error('Seleccione plantilla con nombre Feriados', 'Plantilla seleccionada incorrecta', {
          timeOut: 6000,
        });
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada', {
        timeOut: 6000,
      });
    }
  }

  // MÉTODO PARA ENVIAR MENSAJES DE ERROR O CARGAR DATOS SI LA PLANTILLA ES CORRECTA
  Revisarplantilla() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.RevisarArchivo(formData).subscribe(res => {
      console.log('probando plantilla1', res);
      if (res.message === 'error') {
        this.toastr.error('Para asegurar el buen funcionamiento del sistema es necesario que verifique los datos ' +
          'de la plantilla ingresada, recuerde que los datos no pueden estar duplicados y la fecha de ' +
          'recuperación debe ser posterior a la fecha del feriado a resgistrar.',
          'Verificar los datos ingresados en la plantilla', {
          timeOut: 10000,
        });
        this.archivoForm.reset();
        this.nameFile = '';
      }
      else if (res.message === 'correcto') {
        this.rest.RevisarArchivoDatos(formData).subscribe(respose => {
          console.log('probando plantilla2', respose);
          if (respose.message === 'error') {
            this.toastr.error('Para asegurar el buen funcionamiento del sistema es necesario que verifique los datos ' +
              'de la plantilla ingresada, recuerde que los datos no pueden estar duplicados y la fecha de ' +
              'recuperación debe ser posterior a la fecha del feriado a resgistrar.',
              'Verificar los datos ingresados en la plantilla', {
              timeOut: 10000,
            });
            this.archivoForm.reset();
            this.nameFile = '';
          }
          else if (respose.message === 'correcto') {
            this.rest.subirArchivoExcel(formData).subscribe(subido => {
              console.log('probando plantilla3', subido);
              window.location.reload();
              this.toastr.success('Operación Exitosa', 'Plantilla de Feriados importada.', {
                timeOut: 10000,
              });
              this.archivoForm.reset();
              this.nameFile = '';
            });
          }
        });
      }
    });
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS PDF
   * ****************************************************************************************************/

  GenerarPdf(action = 'open') {
    this.OrdenarDatos(this.feriados);
    const documentDefinition = this.GetDocumentDefinicion();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
    this.ObtenerFeriados();
  }

  GetDocumentDefinicion() {
    sessionStorage.setItem('Feriados', this.feriados);
    return {
      // ENCABEZADO DE LA PÁGINA
      watermark: { text: this.frase, color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por: ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },
      // PIE DE PÁGINA
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
        { image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: 'Lista de Feriados', bold: true, fontSize: 20, alignment: 'center', margin: [0, -10, 0, 10] },
        this.PresentarDataPDFFeriados(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 10, alignment: 'center' },
        itemsTableD: { fontSize: 10 }
      }
    };
  }

  PresentarDataPDFFeriados() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Fecha', style: 'tableHeader' },
                { text: 'Fecha Recuperación', style: 'tableHeader' },
              ],
              ...this.feriados.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTable' },
                  { text: obj.descripcion, style: 'itemsTableD' },
                  { text: obj.fecha, style: 'itemsTable' },
                  { text: obj.fec_recuperacion, style: 'itemsTable' },
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
    this.OrdenarDatos(this.feriados);
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.feriados.map(obj => {
      return {
        CODIGO: obj.id,
        FERIADO: obj.descripcion,
        FECHA: obj.fecha,
        FECHA_RECUPERA: obj.fec_recuperacion
      }
    }));
    // MÉTODO PARA DEFINIR TAMAÑO DE LAS COLUMNAS DEL REPORTE
    const header = Object.keys(this.feriados[0]); // NOMBRE DE CABECERAS DE COLUMNAS
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // CABECERAS AÑADIDAS CON ESPACIOS
      wscols.push({ wpx: 100 })
    }
    wsr["!cols"] = wscols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'LISTA FERIADOS');
    xlsx.writeFile(wb, "FeriadosEXCEL" + new Date().getTime() + '.xlsx');
    this.ObtenerFeriados();
  }

  /* ****************************************************************************************************
   *                               PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  ExportToXML() {
    this.OrdenarDatos(this.feriados);
    var objeto;
    var arregloFeriados = [];
    this.feriados.forEach(obj => {
      objeto = {
        "roles": {
          '@id': obj.id,
          "descripcion": obj.descripcion,
          "fecha": obj.fecha,
          "fec_recuperacion": obj.fec_recuperacion,
        }
      }
      arregloFeriados.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloFeriados).subscribe(res => {
      this.data = res;
      this.urlxml = `${environment.url}/feriados/download/` + this.data.name;
      window.open(this.urlxml, "_blank");
    });
    this.ObtenerFeriados();
  }

  /****************************************************************************************************** 
   * MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  ExportToCVS() {
    this.OrdenarDatos(this.feriados);
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.feriados);
    const csvDataC = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataC], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "FeriadosCSV" + new Date().getTime() + '.csv');
    this.ObtenerFeriados();
  }

}