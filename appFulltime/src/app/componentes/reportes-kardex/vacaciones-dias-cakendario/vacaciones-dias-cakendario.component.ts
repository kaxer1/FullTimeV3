import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { KardexService } from 'src/app/servicios/reportes/kardex.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vacaciones-dias-cakendario',
  templateUrl: './vacaciones-dias-cakendario.component.html',
  styleUrls: ['./vacaciones-dias-cakendario.component.css']
})
export class VacacionesDiasCakendarioComponent implements OnInit {

  empleados: any = [];
  kardex: any = [];

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

  empleadoD: any = [];
  idEmpleado: number;

  constructor(
    private restEmpleado: EmpleadoService,
    private restKardex: KardexService,
    private toastr: ToastrService
  ) { 
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleados();
    this.ObtenerEmpleadoSolicitaKardex(this.idEmpleado)
  }

  ObtenerEmpleados() {
    this.empleados = [];
    this.restEmpleado.getEmpleadosRest().subscribe(res => {
      this.empleados = res;
    });
  }

  KardexEmpleado(id_empleado: number, palabra: string) {
    console.log('conca');
      // this.restKardex.ObtenerKardexVacacionDiasCalendarioByIdEmpleado(id_empleado).subscribe(res => {
      //   this.kardex = res;
      //   console.log(this.kardex);
      //   this.generarPdf(palabra)
        
      // })
  }

  urlImagen: string;
  nombreEmpresa: string;
   // metodo para ver la informacion del empleado 
  ObtenerEmpleadoSolicitaKardex(idemploy: any) {
    this.empleadoD = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      console.log();
      this.empleadoD = data;
    });
    this.restKardex.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.urlImagen = 'data:image/jpeg;base64,' + res.imagen;
      this.nombreEmpresa = res.nom_empresa;
    });

  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
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

  fechaHoy: string;
  getDocumentDefinicion() {
    sessionStorage.setItem('Empleado', this.empleados);
    var f = new Date();
    f.setUTCHours(f.getHours())
    this.fechaHoy = f.toJSON();
    console.log(this.fechaHoy);
    
    return {
      // pageOrientation: 'landscape',
      watermark: { text: 'Reporte', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleadoD[0].nombre + ' ' + this.empleadoD[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },
      
      footer: function (currentPage, pageCount, fecha) {  
        fecha = f.toJSON().split("T")[0];
        var timer = f.toJSON().split("T")[1].slice(0, 5);
        return {
          margin: 10,
          columns: [
            'Fecha: ' + fecha + ' Hora: ' + timer,
            {
              text: [
                {
                  text: '© Pag '  + currentPage.toString() + ' of ' + pageCount,
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
          columns: [
            {
              image: this.urlImagen,
              width: 90,
              height: 40,
            },
            {
              width: '*',
              text: this.nombreEmpresa,
              bold: true,
              fontSize: 20,
              alignment: 'center',
            }
          ]
        },
        {
          style: 'subtitulos',
          text: 'Reporte - Kardex Vacaciones Días Calendario'
        },
        {
          style: 'subtitulos',
          text: 'Fecha de Corte: ' + this.fechaHoy.split("T")[0] + ' ' + this.fechaHoy.split("T")[1].slice(0, 5)
        },
        this.CampoCiudad(this.kardex.empleado[0].ciudad),
        this.CampoInfoEmpleado(this.kardex.empleado[0]),
        this.CampoFechas(this.kardex.empleado[0]),
        this.CampoDetallePeriodo(this.kardex.detalle),
        this.CampoLiquidacionProporcional(this.kardex.proporcional.antiguedad[0], this.kardex.proporcional.periodo[0], this.kardex.liquidacion[0]),

        
        // this.presentarDataPDFEmpleados(),
        // this.kardex
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
          fontSize: 10,
          margin: [0,5,0,5]
        },
        itemsTableDesHas: {
          fontSize: 9,
          margin: [0,5,0,5]
        },
        itemsTableCentrado: {
          fontSize: 10,
          alignment: 'center',
          margin: [0,5,0,5]
        },
        subtitulos: {
          fontSize: 16,
          alignment: 'center',
          margin: [0, 5, 0, 10]
        }
      }
    };
  }

  CampoCiudad(ciudad: string) {
    return {
      table: {
        widths: ['*'],
        body: [
          [
            {
              bold: true,
              fillColor: '#E1BB10',
              border: [false, false, false, false],
              text: 'CIUDAD: ' +  ciudad,
            }
          ]
        ]
      }
    }
  }

  CampoInfoEmpleado(e: any) {
    return {
      table: {
        widths: ['auto', '*', '*'],
        body: [
          [
            {
              bold: true,
              fillColor: '#1BAEFD',
              border: [false, false, false, false],
              text: 'EMPLEADO: ' +  e.nombre,
            },
            {
              bold: true,
              fillColor: '#1BAEFD',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'C.C.: ' + e.cedula,
            },
            {
              bold: true,
              fillColor: '#1BAEFD',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'COD: ' + e.codigo,
            }
          ]
        ]
      }
    }
  }

  CampoFechas(e: any) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', '*'],
        body: [
          [
            {
              bold: true,
              fillColor: '#EAEAEA',
              border: [false, false, false, false],
              text: 'F.INGRESO: ' +  e.fec_ingreso.split('T')[0]
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              border: [false, false, false, false],
              text: 'F.SALIDA: '
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'F.CARGA: ' + e.fec_carga.split('T')[0],
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              alignment: 'center',
              border: [false, false, false, false],
              text: 'ACUM: '
            },
            {
              bold: true,
              fillColor: '#EAEAEA',
              border: [false, false, false, false],
              text: 'ESTADO: ' +  e.estado
            },
          ]
        ]
      }
    }
  }

  CampoDetallePeriodo(d: any[]) {
    return {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 25, 25, 25, 25, 25, 25],
        body: [
          [
            {rowSpan: 2, text: 'Periodo', style: 'tableHeader'}, 
            {rowSpan: 2, text: 'Detalle', style: 'tableHeader'},
            {rowSpan: 2, text: 'Desde', style: 'tableHeader'}, 
            {rowSpan: 2, text: 'Hasta', style: 'tableHeader'}, 
            {colSpan: 3, text: 'Descuento', style: 'tableHeader'},
            '', '',
            {colSpan: 3, text: 'Saldo', style: 'tableHeader'},
            '', ''
          ],
          [
						'', '', '', '',
						{
							style: 'tableHeader',
							text: 'Dias'
            },
            {
							style: 'tableHeader',
							text: 'Hor'
            },
            {
							style: 'tableHeader',
							text: 'Min'
            },
            {
							style: 'tableHeader',
							text: 'Dias'
            },
            {
							style: 'tableHeader',
							text: 'Hor'
            },
            {
							style: 'tableHeader',
							text: 'Min'
						}
          ],
          ...d.map(obj => {
              return [ 
                { style: 'itemsTableCentrado', text: obj.periodo}, 
                { style: 'itemsTable', text: obj.detalle}, 
                { style: 'itemsTableDesHas', text: obj.desde.split("T")[0] + ' ' + obj.desde.split("T")[1].slice(0, 5)}, 
                { style: 'itemsTableDesHas', text: obj.hasta.split("T")[0] + ' ' + obj.desde.split("T")[1].slice(0, 5)}, 
                { style: 'itemsTableCentrado', text: obj.descuento.dias}, 
                { style: 'itemsTableCentrado', text: obj.descuento.horas}, 
                { style: 'itemsTableCentrado', text: obj.descuento.min}, 
                { style: 'itemsTableCentrado', text: obj.saldo.dias}, 
                { style: 'itemsTableCentrado', text: obj.saldo.horas}, 
                { style: 'itemsTableCentrado', text: obj.saldo.min}]
            })
        ]
      }
    }
  }

  CampoLiquidacionProporcional(antiguedad: any, periodo: any, liquidacion: any) {
    console.log(antiguedad);
    console.log(periodo);
    console.log(liquidacion);
    return {
      table: {
        widths: [25, 25, 25, 25, 25, 25, 25, 25, 25],
        body: [
          [
            {colSpan: 6, text: 'Proporcional', style: 'tableHeader'},
            '','','','','',
            {rowSpan: 2, colSpan: 3, text: 'Liquidacion', style: 'tableHeader'},
            '',''
          ],
          [
            {colSpan: 3, text: 'Antigüedad', style: 'tableHeader'},
            '','',
            {colSpan: 3, text: 'Periódo', style: 'tableHeader'},
            '','',
            '','',''
          ],
          [
						{ style: 'tableHeader', text: 'Dias' },
            { style: 'tableHeader', text: 'Hor' },
            { style: 'tableHeader', text: 'Min' },
            { style: 'tableHeader', text: 'Dias' },
            { style: 'tableHeader', text: 'Hor' },
            { style: 'tableHeader', text: 'Min' },
            { style: 'tableHeader', text: 'Dias' },
            { style: 'tableHeader', text: 'Hor' },
            { style: 'tableHeader', text: 'Min' }
          ],
          [
            {style: 'itemsTableCentrado', text: antiguedad.dias},
            {style: 'itemsTableCentrado', text: antiguedad.horas},
            {style: 'itemsTableCentrado', text: antiguedad.min},
            {style: 'itemsTableCentrado', text: periodo.dias},
            {style: 'itemsTableCentrado', text: periodo.horas},
            {style: 'itemsTableCentrado', text: periodo.min},
            {style: 'itemsTableCentrado', text: liquidacion.dias},
            {style: 'itemsTableCentrado', text: liquidacion.horas},
            {style: 'itemsTableCentrado', text: liquidacion.min}
          ],
          [
            {colSpan: 3, text: antiguedad.valor.toString().slice(0,8), style: 'itemsTableCentrado'},
            '','',
            {colSpan: 3, text: periodo.valor.toString().slice(0,8), style: 'itemsTableCentrado'},
            '','',
            {colSpan: 3, text: liquidacion.valor.toString().slice(0,8), style: 'itemsTableCentrado'},
            '',''
          ]
        ]
      }
    }
  }

  /**
   * METODOS PARA CONTROLAR INGRESO DE LETRAS
   */

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
    this.codigo.reset();
    this.cedula.reset();
    this.nombre.reset();
    this.apellido.reset();
  }

}
