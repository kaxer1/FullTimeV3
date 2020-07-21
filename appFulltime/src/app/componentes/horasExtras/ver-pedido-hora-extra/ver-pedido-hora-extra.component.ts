import { Component, OnInit } from '@angular/core';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { MatDialog } from '@angular/material/dialog';
import { HoraExtraAutorizacionesComponent } from '../../autorizaciones/hora-extra-autorizaciones/hora-extra-autorizaciones.component';
import { EditarEstadoHoraExtraAutorizacionComponent } from '../../autorizaciones/editar-estado-hora-extra-autorizacion/editar-estado-hora-extra-autorizacion.component';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EstadoHoraExtraComponent } from "../estado-hora-extra/estado-hora-extra.component";
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-ver-pedido-hora-extra',
  templateUrl: './ver-pedido-hora-extra.component.html',
  styleUrls: ['./ver-pedido-hora-extra.component.css']
})
export class VerPedidoHoraExtraComponent implements OnInit {

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  dataParams: any;
  hora_extra: any = [];
  nomEstado: string;
  HabilitarAutorizacion: boolean = true;
  autorizacion: any = [];
  estado: string = '';
  dep: any = [];
  departamento: string = '';

  // Datos permiso hora extra
  empleado: any = [];
  idEmpleado: number;


  datoSolicitud: any = [];
  datosAutorizacion: any = [];

  constructor(
    private restHE: PedHoraExtraService,
    private restE: EmpleadoService,
    private router: Router,
    private restA: AutorizacionService,
    private restD: DepartamentosService,
    private vistaFolante: MatDialog
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.dataParams = this.router.routerState.snapshot.root.children[0].params;
  }

  ngOnInit(): void {

    console.log(this.dataParams.id);
    this.BuscarInfo();
  }

  id_usua_solicita: number;
  BuscarInfo() {
    this.dep = [];
    this.restHE.ObtenerUnHoraExtra(this.dataParams.id).subscribe(res => {
      this.hora_extra = res;
      this.estados.forEach(obj => {
        if (obj.id === this.hora_extra[0].estado) {
          this.nomEstado = obj.nombre
        }
      })
      console.log(this.hora_extra);
      this.id_usua_solicita = this.hora_extra[0].id_usua_solicita;
      this.restA.getUnaAutorizacionByHoraExtraRest(this.dataParams.id).subscribe(res1 => {
        console.log(res);
        this.autorizacion = res1;
        this.estados.forEach(obj => {
          if (this.autorizacion[0].estado === obj.id) {
            this.estado = obj.nombre;
          }
        });
        this.restD.EncontrarUnDepartamento(this.autorizacion[0].id_departamento).subscribe(res2 => {
          this.dep.push(res2);
          this.dep.forEach(obj => {
            this.departamento = obj.nombre;
          });
        });
      }, error => {
        console.log(error);
        this.HabilitarAutorizacion = false;
      });
    });

    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerSolicitud(this.dataParams.id);
    this.ObtenerAutorizacion(this.dataParams.id);
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
      //this.urlImagen = 'http://localhost:3000/empleado/img/' + this.empleado[0]['imagen'];
    })
  }

  // metodo para ver la informacion de la solicitud 
  ObtenerSolicitud(id: any) {
    this.datoSolicitud = [];
    this.restHE.BuscarDatosSolicitud(id).subscribe(data => {
      this.datoSolicitud = data;
      console.log('datos solicitud', this.datoSolicitud);
    })
  }

  // metodo para ver la informacion de la autorización 
  ObtenerAutorizacion(id: any) {
    console.log('entra')
    this.datosAutorizacion = [];
    this.restHE.BuscarDatosAutorizacion(id, this.idEmpleado).subscribe(data => {
      this.datosAutorizacion = data;
      console.log('autorizacion', this.datosAutorizacion);
      if (this.datosAutorizacion[0].estado_auto === 1) {
        this.datosAutorizacion[0].estado_auto = 'Pendiente';
      }
      else if (this.datosAutorizacion[0].estado_auto === 2) {
        this.datosAutorizacion[0].estado_auto = 'Pre-autorizado';
      }
      else if (this.datosAutorizacion[0].estado_auto === 3) {
        this.datosAutorizacion[0].estado_auto = 'Autorizado';
      }
      else if (this.datosAutorizacion[0].estado_auto === 4) {
        this.datosAutorizacion[0].estado_auto = 'Negado';
      }
      console.log('autorizacion', this.datosAutorizacion);
    })
  }

  AbrirAutorizaciones(datosHoraExtra) {
    this.vistaFolante.open(HoraExtraAutorizacionesComponent, { width: '300px', data: datosHoraExtra }).afterClosed().subscribe(items => {
      this.BuscarInfo();
    });
  }

  AbrirVentanaEditar(datosHoraExtra) {
    this.vistaFolante.open(EstadoHoraExtraComponent, { width: '300px', data: datosHoraExtra }).afterClosed().subscribe(items => {
      this.BuscarInfo();
    });
  }

  AbrirVentanaEditarAutorizacion(AutoHoraExtra) {
    this.vistaFolante.open(EditarEstadoHoraExtraAutorizacionComponent, { width: '300px', data: { autorizacion: [AutoHoraExtra], empl: this.id_usua_solicita } }).afterClosed().subscribe(items => {
      this.BuscarInfo();
    })
  }

  ObtenerFecha() {
    var fecha;
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
    return fecha;
  }

  /****************************************************************************************************** 
*                                         MÉTODO PARA EXPORTAR A PDF ----HORAS EXTRAS
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
          text: 'SOLICITUD DE HORAS EXTRAS',
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },

        this.presentarDataPDFPermiso(this.ObtenerFecha()),
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

  presentarDataPDFPermiso(f) {
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
                      text: 'FECHA: ' + f, style: 'itemsTableD'
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
              ]
            }
          ],
          [
            {
              text: 'HORAS EXTRAS', style: 'tableHeader'
            }
          ],
          [
            {
              columns: [
                {
                  text: [
                    {
                      text: 'DESCRIPCIÓN: ' + this.datoSolicitud[0].descripcion, style: 'itemsTableD'
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
                      text: 'Total Horas Extras: ' + this.datoSolicitud[0].num_hora + ' horas', style: 'itemsTableD'
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
