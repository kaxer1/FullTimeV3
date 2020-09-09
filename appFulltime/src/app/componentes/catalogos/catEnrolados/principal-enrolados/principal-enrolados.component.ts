import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { RegistroEnroladosComponent } from '../registro-enrolados/registro-enrolados.component';
import { EnroladoRelojComponent } from '../enrolado-reloj/enrolado-reloj.component';
import { EditarEnroladosComponent } from 'src/app/componentes/catalogos/catEnrolados/editar-enrolados/editar-enrolados.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EnroladoService } from 'src/app/servicios/catalogos/catEnrolados/enrolado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

interface buscarActivo {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-principal-enrolados',
  templateUrl: './principal-enrolados.component.html',
  styleUrls: ['./principal-enrolados.component.css'],
})

export class PrincipalEnroladosComponent implements OnInit {

  enrolados: any = [];
  idUser = new FormControl('');
  nombre = new FormControl('');
  activo = new FormControl('');
  finger = new FormControl('');

  filtroIdUser: number;
  filtroEnrNombre = '';
  filtroActivo: boolean;
  filtroFinger: number;

  confirmacion = false;

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleado: any = [];
  idEmpleado: number;

  activoBus: buscarActivo[] = [
    { value: true, viewValue: 'Activados' },
    { value: false, viewValue: 'Desactivados' }
  ];

  constructor(
    private rest: EnroladoService,
    public restE: EmpleadoService,
    public restEmpre: EmpresaService,
    public vistaRegistrarDatos: MatDialog,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.getEnrolados();
    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerLogo();
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

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  getEnrolados() {
    this.enrolados = [];
    this.rest.getEnroladosRest().subscribe(data => {
      this.enrolados = data
    });
  }

  AbrirVentanaRegistrarEnrolado() {
    this.vistaRegistrarDatos.open(RegistroEnroladosComponent, { width: '900px' }).disableClose = true;
  }

  AbrirVentanaAsignarReloj(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EnroladoRelojComponent, { width: '400px', data: { datosEnrolado: datosSeleccionados, actualizar: false } }).disableClose = true;
    console.log(datosSeleccionados.nombre);
  }

  // Ventana para editar datos
  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarEnroladosComponent, { width: '900px', data: { datosEnrolado: datosSeleccionados, actualizar: false } }).disableClose = true;
  }


  /* **********************************************************************************
   * ELIMAR REGISTRO ENROLADO Y ENROLADOS-DISPOSITIVO 
   * **********************************************************************************/

  /** Función para eliminar registro seleccionado */
  Eliminar(id_enrolado: number) {
    //console.log("probando id", id_enrolado)
    this.rest.EliminarRegistro(id_enrolado).subscribe(res => {
      this.toastr.error('Registro eliminado');
      this.getEnrolados();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos): void {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/enrolados']);
        }
      });
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

  limpiarCampos() {
    this.idUser.reset();
    this.nombre.reset();
    this.activo.reset();
    this.finger.reset();
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
    let itemName = arrayItems[0].slice(0, 9);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'enrolados') {
        this.plantilla();
      } else {
        this.toastr.error('Solo se acepta Enrolados', 'Plantilla seleccionada incorrecta');
      }
    } else {
      this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
    }
  }

  plantilla() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.subirArchivoExcel(formData).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Enrolados importada.');
      this.getEnrolados();
      window.location.reload();
      this.archivoForm.reset();
      this.nameFile = '';
    });
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
    sessionStorage.setItem('Enrolados', this.enrolados);
    return {

      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
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
        { image: this.logo, width: 150 },
        { text: 'Lista de Usuarios Enrolados', bold: true, fontSize: 20, alignment: 'center', margin: [0, 0, 0, 20] },
        this.presentarDataPDFEnrolados(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: '#6495ED' },
        itemsTable: { fontSize: 10, alignment: 'center', }
      }
    };
  }

  EstadoSelect: any = ['Si', 'No'];
  presentarDataPDFEnrolados() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [30, 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Código', style: 'tableHeader' },
                { text: 'Activo', style: 'tableHeader' },
                { text: 'Finger', style: 'tableHeader' },
                { text: 'Data Finger', style: 'tableHeader' }
              ],
              ...this.enrolados.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTable' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.codigo, style: 'itemsTable' },
                  { text: obj.activo, style: 'itemsTable' },
                  { text: obj.finger, style: 'itemsTable' },
                  { text: obj.data_finger, style: 'itemsTable' }
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
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.enrolados);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'Departamentos');
    xlsx.writeFile(wb, "Departamentos" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   *                                        MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.enrolados);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "DepartamentosCSV" + new Date().getTime() + '.csv');
  }

  /* ****************************************************************************************************
   *                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloEnrolados = [];
    this.enrolados.forEach(obj => {
      objeto = {
        "usuario_enrolado": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "codigo": obj.codigo,
          "activo": obj.activo,
          "finger": obj.finger,
          "data_finger": obj.data_finger,
        }
      }
      arregloEnrolados.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloEnrolados).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://localhost:3000/enrolados/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }
}