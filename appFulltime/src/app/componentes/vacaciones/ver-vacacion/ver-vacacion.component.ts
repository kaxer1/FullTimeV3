import { Component, OnInit } from '@angular/core';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EditarEstadoVacacionAutoriacionComponent } from '../../autorizaciones/editar-estado-vacacion-autoriacion/editar-estado-vacacion-autoriacion.component';
import { EstadoVacacionesComponent } from "../estado-vacaciones/estado-vacaciones.component";
import { VacacionAutorizacionesComponent } from '../../autorizaciones/vacacion-autorizaciones/vacacion-autorizaciones.component';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-ver-vacacion',
  templateUrl: './ver-vacacion.component.html',
  styleUrls: ['./ver-vacacion.component.css']
})

export class VerVacacionComponent implements OnInit {

  vacacion: any = [];
  autorizacion: any = [];
  dep: any = [];
  departamento: string = '';
  estado: string = '';

  HabilitarAutorizacion: boolean = true;

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  // Datos permiso vacación
  empleado: any = [];
  idEmpleado: number;
  id_vacacion: string;

  datoSolicitud: any = [];
  datosAutorizacion: any = [];

  constructor(
    private restV: VacacionesService,
    private toastr: ToastrService,
    private router: Router,
    private restD: DepartamentosService,
    private restA: AutorizacionService,
    public vistaFlotante: MatDialog
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.id_vacacion = this.router.url.split('/')[2];
   }

  ngOnInit(): void {

    this.BuscarDatos();
  }

  BuscarDatos() {
    this.vacacion = [];
    this.autorizacion = [];
    this.dep = [];
    this.restV.ObtenerUnaVacacion(parseInt(this.id_vacacion)).subscribe(res => {

      this.vacacion = res;
      console.log(this.vacacion)
      this.restA.getUnaAutorizacionByVacacionRest(this.vacacion[0].id).subscribe(res1 => {
        this.autorizacion = res1;
        console.log(this.autorizacion);
        this.estados.forEach(obj => {
          if (this.autorizacion[0].estado === obj.id) {
            this.estado = obj.nombre
          }
        })
        this.restD.EncontrarUnDepartamento(this.autorizacion[0].id_departamento).subscribe(res2 => {
          this.dep.push(res2);
          this.dep.forEach(obj => {
            this.departamento = obj.nombre;
          });
        });
      }, error => {
        this.HabilitarAutorizacion = false;
      });
    });
  }


  AbrirVentanaEditar(datosSeleccionados: any): void {
    this.vistaFlotante.open(EstadoVacacionesComponent, { width: '300px', data: {vacacion: datosSeleccionados, depa: this.dep} })
    .afterClosed().subscribe(item => {
      this.BuscarDatos();
    });
  }

  AbrirVentanaEditarAutorizacion(datosSeleccionados: any): void {
    this.vistaFlotante.open(EditarEstadoVacacionAutoriacionComponent, { width: '350px', data: {datosSeleccionados, id_rece_emp: this.vacacion[0].id_empleado}})
    .afterClosed().subscribe(item => {
      this.BuscarDatos();
    });
  }

  AbrirAutorizaciones(datosSeleccionados: any): void {
    this.vistaFlotante.open(VacacionAutorizacionesComponent, { width: '350px', data: datosSeleccionados }).afterClosed().subscribe(item => {
      this.BuscarDatos();
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
    return {
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3 },

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
            'Fecha: ' + fecha + ' Hora: ' + time,
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
          text: this.datoSolicitud[0].nom_empresa,
          bold: true,
          fontSize: 15,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'SOLICITUD DE VACACIONES',
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        this.presentarDataPDFPermiso(),
      ],
      styles: {
        header: {
          fontSize: 9,
          bold: true,
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
          fillColor: '#6495ED',
        },
        tableHeaderA: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED',
          margin: [20, 0, 20, 0],

        },
        itemsTableC: {
          fontSize: 10,
          alignment: 'center',
          margin: [50, 5, 5, 5]

        },
        itemsTableD: {
          fontSize: 10,
          alignment: 'left',
          margin: [50, 5, 5, 5]
        },
        itemsTable: {
          fontSize: 10,
          alignment: 'center',
        }
      }
    };
  }

  presentarDataPDFPermiso() {
    return {
      table: {
        widths: ['*'],
        body: [
          [
            { text: 'INFORMACIÓN GENERAL', style: 'tableHeader' },
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'FECHA: ' + this.datoSolicitud[0].fec_creacion.split('T')[0], style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'CIUDAD: ' + this.datoSolicitud[0].nom_ciudad, style: 'itemsTableD'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'APELLIDOS: ' + this.datoSolicitud[0].apellido_emple, style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'NOMBRES: ' + this.datoSolicitud[0].nombre_emple, style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'CÉDULA: ' + this.datoSolicitud[0].cedula, style: 'itemsTableD'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'RÉGIMEN: ' + this.datoSolicitud[0].nom_regimen, style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Sucursal: ' + this.datoSolicitud[0].nom_sucursal, style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'N°. Permiso: ' + this.datoSolicitud[0].num_permiso, style: 'itemsTableD'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              text: 'MOTIVO', style: 'tableHeader'
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'TIPO DE SOLICITUD: ' + this.datoSolicitud[0].nom_permiso, style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'FECHA DE INICIO: ' + this.datoSolicitud[0].fec_inicio.split('T')[0], style: 'itemsTableD'
                    }
                  ]
                },
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'OBSERVACIÓN: ' + this.datoSolicitud[0].descripcion, style: 'itemsTableD'
                    }
                  ]
                },
                {
                  text: [
                    {
                      text: 'FECHA DE FINALIZACIÓN: ' + this.datoSolicitud[0].fec_final.split('T')[0], style: 'itemsTableD'
                    }
                  ]
                },
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    { width: '*', text: '' },
                    {
                      width: 'auto',
                      layout: 'lightHorizontalLines',
                      table: {
                        widths: ['auto'],
                        body: [
                          [
                            { text: this.datosAutorizacion[0].estado_auto.toUpperCase() + ' POR', style: 'tableHeaderA' },
                          ],
                          [
                            { text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },
                          ],
                          [
                            { text: this.datosAutorizacion[0].nombre + ' ' + this.datosAutorizacion[0].apellido + '\n' + this.datosAutorizacion[0].cargo, style: 'itemsTable' },
                          ]
                        ]
                      }
                    },
                    { width: '*', text: '' },
                  ]
                },
                {
                  columns: [
                    { width: '*', text: '' },
                    {
                      width: 'auto',
                      layout: 'lightHorizontalLines',
                      table: {
                        widths: ['auto'],
                        body: [
                          [
                            { text: 'EMPLEADO', style: 'tableHeaderA' },
                          ],
                          [
                            { text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },
                          ],
                          [
                            { text: this.datoSolicitud[0].nombre_emple + ' ' + this.datoSolicitud[0].apellido_emple + '\n' + this.datoSolicitud[0].cargo, style: 'itemsTable' },
                          ]
                        ]
                      }
                    },
                    { width: '*', text: '' },
                  ]
                }
              ]
            }
          ],
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
        },
        paddingLeft: function (i, node) { return 40; },
        paddingRight: function (i, node) { return 40; },
        paddingTop: function (i, node) { return 10; },
        paddingBottom: function (i, node) { return 10; }
      }
    };
  }

}
