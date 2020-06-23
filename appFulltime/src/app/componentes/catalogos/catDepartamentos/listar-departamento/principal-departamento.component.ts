import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { RegistroDepartamentoComponent } from 'src/app/componentes/catalogos/catDepartamentos/registro-departamento/registro-departamento.component';
import { EditarDepartamentoComponent } from 'src/app/componentes/catalogos/catDepartamentos/editar-departamento/editar-departamento.component';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-principal-departamento',
  templateUrl: './principal-departamento.component.html',
  styleUrls: ['./principal-departamento.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class PrincipalDepartamentoComponent implements OnInit {

  // Almacenamiento de datos consultados y filtros de búsqueda
  filtroNombre = '';
  filtroNombreSuc = '';
  filtroEmpresaSuc = '';
  filtroDeparPadre = '';
  departamentos: any = [];
  prueba: any = [];

  // Control de campos y validaciones del formulario
  departamentoF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  departamentoPadreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  buscarNombre = new FormControl('', [Validators.minLength(2)]);
  buscarEmpresa = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarDepartamentosForm = new FormGroup({
    departamentoForm: this.departamentoF,
    departamentoPadreForm: this.departamentoPadreF,
    buscarNombreForm: this.buscarNombre,
    buscarEmpresaForm: this.buscarEmpresa
  });

  // items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleado: any = [];
  idEmpleado: number;

  constructor(
    private rest: DepartamentosService,
    public restE: EmpleadoService,
    private toastr: ToastrService,
    public vistaRegistrarDepartamento: MatDialog
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
   }

  ngOnInit(): void {
    this.ListaDepartamentos();
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
    this.numero_pagina = e.pageIndex + 1
  }

  ListaDepartamentos() {
    this.departamentos = []
    this.rest.ConsultarDepartamentos().subscribe(datos => {
      this.departamentos = datos
    })
  }

  AbrirVentanaRegistrarDepartamento(): void {
    this.vistaRegistrarDepartamento.open(RegistroDepartamentoComponent, { width: '600px' }).disableClose = true;
  }

  AbrirVentanaEditarDepartamento(departamento: any): void {
    const DIALOG_REF = this.vistaRegistrarDepartamento.open(EditarDepartamentoComponent,
      { width: '600px', data: departamento });
    DIALOG_REF.disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarDepartamentosForm.setValue({
      departamentoForm: '',
      departamentoPadreForm: '',
      buscarNombreForm: '',
      buscarEmpresaForm: ''
    });
    this.ListaDepartamentos();

  }

  ObtenerMensajeDepartamentoLetras() {
    if (this.departamentoF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeDepartamentoPadreLetras() {
    if (this.departamentoPadreF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
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
    sessionStorage.setItem('Departamentos', this.departamentos);
    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.095, bold: true, italics: false },
      header: { text: 'Usuario: ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

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
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha,
            {
              text: [
                {
                  text: '© ' + currentPage.toString() + ' of ' + pageCount,
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
          text: 'Lista de Departamentos',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFDepartamentos(),
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
        }
      }
    };
  }

  presentarDataPDFDepartamentos() {
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
                { text: 'Empresa', style: 'tableHeader' },
                { text: 'Sucursal', style: 'tableHeader' },
                { text: 'Departamento', style: 'tableHeader' },
                { text: 'Nivel', style: 'tableHeader' },
                { text: 'Departamento Superior', style: 'tableHeader' }
              ],
              ...this.departamentos.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableC' },
                  { text: obj.nomempresa, style: 'itemsTable' },
                  { text: obj.nomsucursal, style: 'itemsTable' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.nivel, style: 'itemsTableC' },
                  { text: obj.departamento_padre, style: 'itemsTableC' }
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
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.departamentos);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'Departamentos');
    xlsx.writeFile(wb, "Departamentos" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   *                                        MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.departamentos);
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
    var arregloDepartamentos = [];
    this.departamentos.forEach(obj => {
      objeto = {
        "departamento": {
          '@id': obj.id,
          "empresa": obj.nomempresa,
          "sucursal": obj.nomsucursal,
          "departamento": obj.nombre,
          "nivel": obj.nivel,
          "departamento_superior": obj.departamento_padre,
        }
      }
      arregloDepartamentos.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloDepartamentos).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://localhost:3000/departamento/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

}


