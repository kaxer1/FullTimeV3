import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { RelojesService } from 'src/app/servicios/catalogos/catRelojes/relojes.service';
import { RelojesComponent } from 'src/app/componentes/catalogos/catRelojes/relojes/relojes.component';
import { PageEvent } from '@angular/material/paginator';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-listar-relojes',
  templateUrl: './listar-relojes.component.html',
  styleUrls: ['./listar-relojes.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class ListarRelojesComponent implements OnInit {

  // Almacenamiento de datos y búsqueda
  filtroNombreReloj = '';
  filtroModeloReloj = '';
  filtroIpReloj = '';
  filtroEmpresaReloj = '';
  filtroSucursalReloj = '';
  filtroDepartamentoReloj = '';
  relojes: any = [];

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);
  empresaF = new FormControl('', [Validators.minLength(2)]);
  sucursalF = new FormControl('', [Validators.minLength(2)]);
  departamentoF = new FormControl('', [Validators.minLength(2)]);
  ipF = new FormControl('');
  modeloF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarRelojesForm = new FormGroup({
    nombreForm: this.nombreF,
    ipForm: this.ipF,
    modeloForm: this.modeloF,
    empresaForm: this.empresaF,
    sucursalForm: this.sucursalF,
    departamentoForm: this.departamentoF
  });

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private rest: RelojesService,
    public router: Router,
    public vistaRegistrarRelojes: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerReloj();
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerReloj() {
    this.relojes = [];
    this.rest.ConsultarRelojes().subscribe(datos => {
      this.relojes = datos;
    })
  }

  IngresarIp(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 46) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  AbrirVentanaRegistrarReloj(): void {
    this.vistaRegistrarRelojes.open(RelojesComponent, { width: '1200px' }).disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarRelojesForm.setValue({
      nombreForm: '',
      ipForm: '',
      modeloForm: '',
      empresaForm: '',
      sucursalForm: '',
      departamentoForm: ''
    });
    this.ObtenerReloj();
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
    let itemName = arrayItems[0].slice(0,7);
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'relojes') {
        this.plantilla();
      } else {
        this.toastr.error('Solo se acepta Dispositvos', 'Plantilla seleccionada incorrecta');
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
      this.ObtenerReloj();
      this.toastr.success('Operación Exitosa', 'Plantilla de Relojes importada.');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  /**
   * 
   * GENERACION DE PDF
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
    sessionStorage.setItem('Dispositivos', this.relojes);
    return {
      pageOrientation: 'landscape', 
      content: [
        {
          text: 'Dispositivos ',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFRelojes(),
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
          fontSize: 11,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        },
        itemsTable: {
          fontSize: 9
        }
      }
    };
  }

  presentarDataPDFRelojes() {
    return {
      table: {
        widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
        body: [
          [
            {text: 'Id', style: 'tableHeader'},
            {text: 'Nombre', style: 'tableHeader'},
            {text: 'IP', style: 'tableHeader'},
            {text: 'Puerto', style: 'tableHeader'},
            {text: 'Marca', style: 'tableHeader'},
            {text: 'Modelo', style: 'tableHeader'},
            {text: 'Serie', style: 'tableHeader'},
            {text: 'ID Fabricante', style: 'tableHeader'},
            {text: 'Fabricante', style: 'tableHeader'},
            {text: 'Mac', style: 'tableHeader'},
            {text: 'Departamento', style: 'tableHeader'},
            {text: 'Sucursal', style: 'tableHeader'},
            {text: 'Empresa', style: 'tableHeader'},
            {text: 'Ciudad', style: 'tableHeader'}
          ],
          ...this.relojes.map(obj => {
            return [
              {text: obj.id, style: 'itemsTable'}, 
              {text: obj.nombre, style: 'itemsTable'}, 
              {text: obj.ip, style: 'itemsTable'}, 
              {text: obj.puerto, style: 'itemsTable'}, 
              {text: obj.marca, style: 'itemsTable'},
              {text: obj.modelo, style: 'itemsTable'}, 
              {text: obj.serie, style: 'itemsTable'}, 
              {text: obj.id_fabricacion, style: 'itemsTable'}, 
              {text: obj.fabricante, style: 'itemsTable'}, 
              {text: obj.mac, style: 'itemsTable'}, 
              {text: obj.nomdepar, style: 'itemsTable'}, 
              {text: obj.nomsucursal, style: 'itemsTable'}, 
              {text: obj.nomempresa, style: 'itemsTable'}, 
              {text: obj.nomciudad, style: 'itemsTable'}
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
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relojes);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'relojes');
    xlsx.writeFile(wb, "RelojesEXCEL" + new Date().getTime() + '.xlsx');
  }

}
