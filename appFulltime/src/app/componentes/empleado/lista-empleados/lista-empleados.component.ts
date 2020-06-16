import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as xml from 'xml-js';
import * as FileSaver from 'file-saver';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class ListaEmpleadosComponent implements OnInit {

  empleado: any = [];
  nacionalidades: any = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cedula'];
  
  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  apellido = new FormControl('', [Validators.minLength(2)]);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombre: '';
  filtroApellido: '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public rest: EmpleadoService,
    public router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getEmpleados();
    this.obtenerNacionalidades();
  }

  ManejarPagina(e: PageEvent){
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

  getEmpleados(){
    this.empleado = [];
    this.rest.getEmpleadosRest().subscribe(data => {
      this.empleado = data;
    })
  }

  verEmpleado(id: any){
    this.empleado = []
    this.rest.getOneEmpleadoRest(id).subscribe(data => {
      this.empleado = data;
    })
  }

  limpiarCampos(){
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
  archivoSubido: Array < File > ;
  archivoForm = new FormControl('', Validators.required);

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems =  this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0,9);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'empleados') {
        this.plantilla();
      } else {
        this.toastr.error('Solo se acepta Empleados', 'Plantilla seleccionada incorrecta');
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
      this.toastr.success('Operación Exitosa', 'Plantilla de Empleados importada.');
      this.getEmpleados();
      window.location.reload();
    });
    this.archivoForm.reset();
    this.nameFile = '';
  }

  /**
   * 
   * METODOS PARA PDF
   * 
   */

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
      pageOrientation: 'landscape', 
      content: [
        {
          text: 'Empleados',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFEmpleados(),
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
          fontSize: 10,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 8
        }
      }
    };
  }

  EstadoCivilSelect: any = ['Soltero/a','Unión de Hecho','Casado/a','Divorciado/a','Viudo/a'];
  GeneroSelect: any = ['Masculino','Femenino'];
  EstadoSelect: any = ['Activo','Inactivo'];
  presentarDataPDFEmpleados() {
    return {
      table: {
        widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
        body: [
          [
            {text: 'Id', style: 'tableHeader'},
            {text: 'Nombre', style: 'tableHeader'},
            {text: 'Apellido', style: 'tableHeader'},
            {text: 'Cedula', style: 'tableHeader'},
            {text: 'Fecha Nacimiento', style: 'tableHeader'},
            {text: 'Correo', style: 'tableHeader'},
            {text: 'Correo Alternativo', style: 'tableHeader'},
            {text: 'Género', style: 'tableHeader'},
            {text: 'Estado Civil', style: 'tableHeader'},
            {text: 'Domicilio', style: 'tableHeader'},
            {text: 'Teléfono', style: 'tableHeader'},
            {text: 'Estado', style: 'tableHeader'},
            {text: 'Nacionalidad', style: 'tableHeader'},
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
              {text: obj.id, style: 'itemsTable'}, 
              {text: obj.nombre, style: 'itemsTable'}, 
              {text: obj.apellido, style: 'itemsTable'}, 
              {text: obj.cedula, style: 'itemsTable'}, 
              {text: obj.fec_nacimiento.split("T")[0], style: 'itemsTable'},
              {text: obj.correo, style: 'itemsTable'}, 
              {text: obj.mail_alternativo, style: 'itemsTable'}, 
              {text: genero, style: 'itemsTable'}, 
              {text: estadoCivil, style: 'itemsTable'}, 
              {text: obj.domicilio, style: 'itemsTable'}, 
              {text: obj.telefono, style: 'itemsTable'}, 
              {text: estado, style: 'itemsTable'}, 
              {text: nacionalidad, style: 'itemsTable'} 
            ];
          })
        ]
      }
    };
  }
  

  /**
   * 
   * METODO PARA EXPORTAR A EXCEL
   * 
   */

  exportToExcel() {
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleado);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'empleados');
    xlsx.writeFile(wb, "EmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

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
          '@id': obj.id,
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
      this.data = res;
      this.urlxml = 'http://192.168.0.192:3001/empleado/download/' + this.data.name;
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
