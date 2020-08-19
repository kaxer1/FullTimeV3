import { Component, OnInit } from '@angular/core';
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
import { HorasExtrasRealesService } from 'src/app/servicios/reportes/horasExtrasReales/horas-extras-reales.service';

@Component({
  selector: 'app-hora-extra-real',
  templateUrl: './hora-extra-real.component.html',
  styleUrls: ['./hora-extra-real.component.css']
})
export class HoraExtraRealComponent implements OnInit {

  empleado: any = [];
  nacionalidades: any = [];

  // Arreglo datos contrato actual
  datosContratoA: any = [];

  // Arreglo datos cargo actual
  datosCargoA: any = [];

  // Arreglo datos cargo actual
  datosTotales: any = [];

  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cedula'];

  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre = new FormControl('', [Validators.minLength(2)]);
  apellido = new FormControl('', [Validators.minLength(2)]);
  departamentoF = new FormControl('', [Validators.minLength(2)]);
  regimenF = new FormControl('', [Validators.minLength(2)]);
  cargoF = new FormControl('', [Validators.minLength(2)]);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombre: '';
  filtroApellido: '';
  filtroDepartamento: '';
  filtroRegimen: '';
  filtroCargo: '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleadoD: any = [];
  idEmpleado: number;

  constructor(
    public rest: EmpleadoService,
    public restH: HorasExtrasRealesService,
    public router: Router,
    private toastr: ToastrService,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.getEmpleados();
    this.obtenerNacionalidades();
    this.ObtenerEmpleados(this.idEmpleado);

    this.VerDatosContratoA();
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleadoD = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoD = data;
    })
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  cont: number = 0;
  iteracion: number = 0;
  // Mostrar datos de los empleados según su contrato Actual
  VerDatosContratoA(): any {
    this.cont = 0;
    this.iteracion = 0;
    this.datosContratoA = [];
    this.datosTotales = [];
    this.restH.ObtenerDatosContratoA().subscribe(data => {
      this.datosContratoA = data;
      console.log('Datos', this.datosContratoA);
      for (var i = 0; i <= this.datosContratoA.length - 1; i++) {
        console.log('i id', this.datosContratoA[i].id);
        this.restH.ObtenerDatosCargoA(this.datosContratoA[i].id).subscribe(datos => {
          console.log('i', this.iteracion);
          this.datosCargoA = [];
          this.datosCargoA = datos;
          console.log('num id', this.datosContratoA[this.iteracion].id);
          if (this.datosCargoA.length != 0) {
            if (this.datosContratoA[this.iteracion].id === this.datosCargoA[0].emple_id) {
              console.log('Cargo', this.datosCargoA);
              let cargarDatos = [{
                id: this.datosContratoA[this.iteracion].id,
                apellido: this.datosContratoA[this.iteracion].apellido,
                cedula: this.datosContratoA[this.iteracion].cedula,
                codigo: this.datosContratoA[this.iteracion].codigo,
                correo: this.datosContratoA[this.iteracion].correo,
                domicilio: this.datosContratoA[this.iteracion].domicilio,
                esta_civil: this.datosContratoA[this.iteracion].esta_civil,
                estado: this.datosContratoA[this.iteracion].estado,
                fec_nacimiento: this.datosContratoA[this.iteracion].fec_nacimiento,
                genero: this.datosContratoA[this.iteracion].genero,
                id_contrato: this.datosContratoA[this.iteracion].id_contrato,
                id_nacionalidad: this.datosContratoA[this.iteracion].id_nacionalidad,
                imagen: this.datosContratoA[this.iteracion].imagen,
                mail_alternativo: this.datosContratoA[this.iteracion].mail_alternativo,
                nombre: this.datosContratoA[this.iteracion].nombre,
                regimen: this.datosContratoA[this.iteracion].regimen,
                telefono: this.datosContratoA[this.iteracion].telefono,
                cargo: this.datosCargoA[0].cargo,
                departamento: this.datosCargoA[0].departamento,
                id_cargo: this.datosCargoA[0].id_cargo,
                id_departamento: this.datosCargoA[0].id_departamento,
                id_sucursal: this.datosCargoA[0].id_sucursal,
                sucursal: this.datosCargoA[0].sucursal
              }];
              if (this.cont === 0) {
                this.datosTotales = cargarDatos
                this.cont++;
                this.iteracion++;
              }
              else {
                this.datosTotales = this.datosTotales.concat(cargarDatos);
                this.iteracion++;
              }
            }
          }
          if (this.iteracion === this.datosContratoA.length) {
            console.log("Datos Totales" + '', this.datosTotales);
          }
        }, error => {
          this.iteracion++;
        })
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

  getEmpleados() {
    this.empleado = [];
    this.rest.getEmpleadosRest().subscribe(data => {
      this.empleado = data;
      //console.log(this.empleado);
    })
  }


  limpiarCampos() {
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
    this.departamentoF.reset();
    this.regimenF.reset();
    this.cargoF.reset();
  }

  obtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
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
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoD[0].nombre + ' ' + this.empleadoD[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

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
            'Fecha: ' + fecha + ' Hora: ' + time, ,
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
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
        },
        itemsTableD: {
          fontSize: 8,
          alignment: 'center'
        }
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
            widths: [30, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
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
                  { text: obj.id, style: 'itemsTableD' },
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
