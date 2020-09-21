import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { TipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';
import { EditarTipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/editar-tipo-comidas/editar-tipo-comidas.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-listar-tipo-comidas',
  templateUrl: './listar-tipo-comidas.component.html',
  styleUrls: ['./listar-tipo-comidas.component.css']
})

export class ListarTipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);
  archivoForm = new FormControl('', Validators.required);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  // Almacenamiento de datos consultados  
  tipoComidas: any = [];
  filtroNombre = '';

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  empleado: any = [];
  idEmpleado: number;

  constructor(
    private rest: TipoComidasService,
    public restE: EmpleadoService,
    public restEmpre: EmpresaService,
    public router: Router,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerTipoComidas();
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

  // Lectura de datos
  ObtenerTipoComidas() {
    this.tipoComidas = [];
    this.rest.ConsultarTipoComida().subscribe(datos => {
      this.tipoComidas = datos;
    })
  }

  AbrirVentanaRegistrarTipoComidas(): void {
    this.vistaRegistrarDatos.open(TipoComidasComponent, { width: '350px' }).afterClosed().subscribe(items => {
      this.ObtenerTipoComidas();
    });
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarTipoComidasComponent, { width: '350px', data: datosSeleccionados }).afterClosed().subscribe(items => {
      this.ObtenerTipoComidas();
    });
  }

  LimpiarCampos() {
    this.BuscarTipoComidaForm.setValue({
      nombreForm: '',
    });
    this.ObtenerTipoComidas();
  }

  /** Función para eliminar registro seleccionado */
  Eliminar(id_tipo: number) {
    //console.log("probando id", id_prov)
    this.rest.EliminarRegistro(id_tipo).subscribe(res => {
      this.toastr.error('Registro eliminado');
      this.ObtenerTipoComidas();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos: any) {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/listarTipoComidas']);
        }
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
    sessionStorage.setItem('Comidas', this.tipoComidas);
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
        { text: 'Lista de Tipos de Comidas', bold: true, fontSize: 20, alignment: 'center', margin: [0, 0, 0, 20] },
        this.presentarDataPDFAlmuerzos(),
      ],
      styles: {
        tableHeader: { fontSize: 12, bold: true, alignment: 'center', fillColor: '#6495ED' },
        itemsTable: { fontSize: 10 },
        itemsTableD: { fontSize: 10, alignment: 'center' }
      }
    };
  }

  presentarDataPDFAlmuerzos() {
    return {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: [30, 'auto', 'auto', 60],
            body: [
              [
                { text: 'Id', style: 'tableHeader' },
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Observación', style: 'tableHeader' },
                { text: 'Valor', style: 'tableHeader' }
              ],
              ...this.tipoComidas.map(obj => {
                return [
                  { text: obj.id, style: 'itemsTableD' },
                  { text: obj.nombre, style: 'itemsTable' },
                  { text: obj.observacion, style: 'itemsTable' },
                  { text: '$ ' + obj.valor, style: 'itemsTableD' }
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
    const wsr: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tipoComidas);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wsr, 'TipoComidas');
    xlsx.writeFile(wb, "Comidas" + new Date().getTime() + '.xlsx');
  }

  /****************************************************************************************************** 
   *                                        MÉTODO PARA EXPORTAR A CSV 
   ******************************************************************************************************/

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.tipoComidas);
    const csvDataH = xlsx.utils.sheet_to_csv(wse);
    const data: Blob = new Blob([csvDataH], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "TipoComidasCSV" + new Date().getTime() + '.csv');
  }

  /* ****************************************************************************************************
   *                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/

  urlxml: string;
  data: any = [];
  exportToXML() {
    var objeto;
    var arregloComidas = [];
    this.tipoComidas.forEach(obj => {
      objeto = {
        "tipo_comida": {
          '@id': obj.id,
          "nombre": obj.nombre,
          "observacion": obj.observacion,
          "valor": obj.valor,
        }
      }
      arregloComidas.push(objeto)
    });

    this.rest.DownloadXMLRest(arregloComidas).subscribe(res => {
      this.data = res;
      console.log("prueba data", res)
      this.urlxml = 'http://192.168.0.192:3001/tipoComidas/download/' + this.data.name;
      window.open(this.urlxml, "_blank");
    });
  }

  /* ****************************************************************************************************
   *                                 PARA LA EXPORTACIÓN DE ARCHIVOS XML
   * ****************************************************************************************************/
  nameFile: string;
  archivoSubido: Array<File>;
  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 15);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'tipo comidas') {
        this.plantilla();
        this.ObtenerTipoComidas();
        window.location.reload();
      } else {
        this.toastr.error('Solo se acepta Tipo Comidas', 'Plantilla seleccionada incorrecta');
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
      this.toastr.success('Operación Exitosa', 'Plantilla de Tipo Comidas importada.');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

}
