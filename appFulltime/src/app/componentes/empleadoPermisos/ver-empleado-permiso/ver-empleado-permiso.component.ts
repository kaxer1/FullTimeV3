import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { EditarEmpleadoPermisoComponent } from '../editar-empleado-permiso/editar-empleado-permiso.component';
import { AutorizacionesComponent } from '../../autorizaciones/autorizaciones/autorizaciones.component';
import { EditarEstadoAutorizaccionComponent } from '../../autorizaciones/editar-estado-autorizaccion/editar-estado-autorizaccion.component';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { DatosGeneralesService } from 'src/app/servicios/datosGenerales/datos-generales.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-ver-empleado-permiso',
  templateUrl: './ver-empleado-permiso.component.html',
  styleUrls: ['./ver-empleado-permiso.component.css']
})

export class VerEmpleadoPermisoComponent implements OnInit {

  InfoPermiso: any = [];
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

  empleado: any = [];
  idEmpleado: number;
  id_permiso: string;

  datoSolicitud: any = [];
  datosAutorizacion: any = [];

  constructor(
    private restP: PermisosService,
    private restA: AutorizacionService,
    public restE: EmpleadoService,
    public restEmpre: EmpresaService,
    public restGeneral: DatosGeneralesService,
    private router: Router,
    private restD: DepartamentosService,
    public vistaFlotante: MatDialog
  ) {
    this.idEmpleado = parseInt(localStorage.getItem('empleado'));
    this.id_permiso = this.router.url.split('/')[2];
  }

  ngOnInit(): void {
    this.BuscarDatos();
    this.ObtenerLogo();
    this.ObtnerColores();
  }

  BuscarDatos() {
    this.InfoPermiso = [];
    this.dep = [];
    this.restP.obtenerUnPermisoEmleado(parseInt(this.id_permiso)).subscribe(res => {
      this.InfoPermiso = res;
      console.log(this.InfoPermiso)
      this.restA.getUnaAutorizacionByPermisoRest(this.InfoPermiso[0].id).subscribe(res1 => {
        this.autorizacion = res1;
        this.estados.forEach(obj => {
          if (this.autorizacion[0].estado === obj.id) {
            this.estado = obj.nombre;
          }
        })
        this.restD.EncontrarUnDepartamento(this.autorizacion[0].id_departamento).subscribe(res2 => {
          this.dep.push(res2);
          this.dep.forEach((obj: { nombre: string; }) => {
            this.departamento = obj.nombre;
          });
        });
      }, error => {
        this.HabilitarAutorizacion = false;
      });
    });

    this.ObtenerEmpleados(this.idEmpleado);
    this.ObtenerSolicitud(this.id_permiso);
    this.ObtenerAutorizacion(this.id_permiso);
  }

  // Método para obtener el logo de la empresa
  logo: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logo = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  // Método para obtener colores de empresa
  p_color: any;
  s_color: any;
  ObtnerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  // Método para ver la información de la solicitud 
  ObtenerSolicitud(id: any) {
    this.datoSolicitud = [];
    this.restP.BuscarDatosSolicitud(id).subscribe(data => {
      this.datoSolicitud = data;
      console.log('datos solicitud', this.datoSolicitud);
    })
  }

  // Método para ver la información de la autorización 
  consulta: any = [];
  datosEmpleadoAutoriza: any = [];
  cont: number;
  ObtenerAutorizacion(id: any) {
    this.datosAutorizacion = [];
    this.datosEmpleadoAutoriza = [];
    this.restP.BuscarDatosAutorizacion(id).subscribe(data => {
      this.datosAutorizacion = data;
      console.log('autorizacion', this.datosAutorizacion);
      var autorizaciones = this.datosAutorizacion[0].empleado_estado.split(',');
      console.log('tamaño', autorizaciones.length, ' cadena ', autorizaciones);

      autorizaciones.map((obj: string) => {
        if (obj != '') {
          let empleado_id = obj.split('_')[0];
          var estado_auto = obj.split('_')[1];
          if (estado_auto === '1') {
            estado_auto = 'Pendiente';
          }
          else if (estado_auto === '2') {
            estado_auto = 'Pre-autorizado';
          }
          else if (estado_auto === '3') {
            estado_auto = 'Autorizado';
          }
          else if (estado_auto === '4') {
            estado_auto = 'Negado';
          }
          this.restGeneral.AutorizaEmpleado(parseInt(empleado_id)).subscribe(dataE => {
            this.consulta = [];
            this.consulta = dataE;
            for (var i = 0; i < this.consulta.length; i++) {
              this.consulta[i].estado = estado_auto;
              console.log(this.consulta);
            }
            if (this.datosEmpleadoAutoriza.length == 0) {
              this.datosEmpleadoAutoriza = this.consulta;
            } else {
              this.datosEmpleadoAutoriza = this.datosEmpleadoAutoriza.concat(this.consulta);
            }
            this.cont = this.datosEmpleadoAutoriza.length;
            console.log('empleado', this.datosEmpleadoAutoriza);
          });
        }
      })
      console.log('autorizacion', this.datosAutorizacion);
    })
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    this.vistaFlotante.open(EditarEmpleadoPermisoComponent, { width: '300px', data: { permiso: datosSeleccionados, depa: this.dep } })
      .afterClosed().subscribe(item => {
        this.BuscarDatos();
      });
  }

  AbrirAutorizaciones(datosSeleccionados: any): void {
    this.vistaFlotante.open(AutorizacionesComponent, { width: '300px', data: datosSeleccionados }).afterClosed().subscribe(items => {
      this.BuscarDatos();
      this.HabilitarAutorizacion = true;
    });
  }

  AbrirVentanaEditarAutorizacion(datosSeleccionados: any): void {
    this.vistaFlotante.open(EditarEstadoAutorizaccionComponent, { width: '350px', data: { auto: datosSeleccionados, empl: this.InfoPermiso } })
      .afterClosed().subscribe(item => {
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
      // Encabezado de la página
      pageOrientation: 'landscape',
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      // Pie de página
      footer: function (currentPage: { toString: () => string; }, pageCount: string, fecha: string) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');

        // Formato de hora actual
        if (h.getMinutes() < 10) {
          var time = h.getHours() + ':0' + h.getMinutes();
        }
        else {
          var time = h.getHours() + ':' + h.getMinutes();
        }
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
          ], fontSize: 10, color: '#A4B8FF',
        }
      },
      content: [
        {       image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: this.datoSolicitud[0].nom_empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, 0, 0, 20] },
        { text: 'SOLICITUD DE PERMISO', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 20] },
        //this.presentarDataPDFPermiso_Uno(),
        this.SeleccionarMetodo(),
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, },
        tableHeaderA: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.s_color, margin: [20, 0, 20, 0], },
        itemsTableD: { fontSize: 10, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTable: { fontSize: 10, alignment: 'center', }
      }
    };
  }

  SeleccionarMetodo() {
    console.log('contador', this.cont)
    if (this.cont === 1) {
      return {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'INFORMACIÓN GENERAL', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'FECHA: ' + this.datoSolicitud[0].fec_creacion.split('T')[0], style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'CIUDAD: ' + this.datoSolicitud[0].nom_ciudad, style: 'itemsTableD' }] }
              ]
            }],
            [{
              columns: [
                { text: [{ text: 'APELLIDOS: ' + this.datoSolicitud[0].apellido_emple, style: 'itemsTableD' }] },
                { text: [{ text: 'NOMBRES: ' + this.datoSolicitud[0].nombre_emple, style: 'itemsTableD' }] },
                { text: [{ text: 'CÉDULA: ' + this.datoSolicitud[0].cedula, style: 'itemsTableD' }] }
              ]
            }],
            [{
              columns: [
                { text: [{ text: 'RÉGIMEN: ' + this.datoSolicitud[0].nom_regimen, style: 'itemsTableD' }] },
                { text: [{ text: 'Sucursal: ' + this.datoSolicitud[0].nom_sucursal, style: 'itemsTableD' }] },
                { text: [{ text: 'N°. Permiso: ' + this.datoSolicitud[0].num_permiso, style: 'itemsTableD' }] }
              ]
            }],
            [{ text: 'MOTIVO', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'TIPO DE SOLICITUD: ' + this.datoSolicitud[0].nom_permiso, style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'FECHA DE INICIO: ' + this.datoSolicitud[0].fec_inicio.split('T')[0], style: 'itemsTableD' }] },]
            }],
            [{
              columns: [
                { text: [{ text: 'OBSERVACIÓN: ' + this.datoSolicitud[0].descripcion, style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'FECHA DE FINALIZACIÓN: ' + this.datoSolicitud[0].fec_final.split('T')[0], style: 'itemsTableD' }] },
              ]
            }],
            [{
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
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 1].estado.toUpperCase() + ' POR', style: 'tableHeaderA' },],
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },],
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 1].e_nombre + ' ' + this.datosEmpleadoAutoriza[this.cont - 1].e_apellido + '\n' + this.datosEmpleadoAutoriza[this.cont - 1].cargo, style: 'itemsTable' },]
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
                          [{ text: 'EMPLEADO', style: 'tableHeaderA' },],
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },],
                          [{ text: this.datoSolicitud[0].nombre_emple + ' ' + this.datoSolicitud[0].apellido_emple + '\n' + this.datoSolicitud[0].cargo, style: 'itemsTable' },]
                        ]
                      }
                    },
                    { width: '*', text: '' },
                  ]
                }
              ]
            }],
          ]
        },
        layout: {
          hLineColor: function (i: number, node: { table: { body: string | any[]; }; }) {
            return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
          },
          paddingLeft: function (i: any, node: any) { return 40; },
          paddingRight: function (i: any, node: any) { return 40; },
          paddingTop: function (i: any, node: any) { return 10; },
          paddingBottom: function (i: any, node: any) { return 10; }
        }
      };
    } else {
      return {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'INFORMACIÓN GENERAL', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'FECHA: ' + this.datoSolicitud[0].fec_creacion.split('T')[0], style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'CIUDAD: ' + this.datoSolicitud[0].nom_ciudad, style: 'itemsTableD' }] }
              ]
            }],
            [{
              columns: [
                { text: [{ text: 'APELLIDOS: ' + this.datoSolicitud[0].apellido_emple, style: 'itemsTableD' }] },
                { text: [{ text: 'NOMBRES: ' + this.datoSolicitud[0].nombre_emple, style: 'itemsTableD' }] },
                { text: [{ text: 'CÉDULA: ' + this.datoSolicitud[0].cedula, style: 'itemsTableD' }] }
              ]
            }],
            [{
              columns: [
                { text: [{ text: 'RÉGIMEN: ' + this.datoSolicitud[0].nom_regimen, style: 'itemsTableD' }] },
                { text: [{ text: 'Sucursal: ' + this.datoSolicitud[0].nom_sucursal, style: 'itemsTableD' }] },
                { text: [{ text: 'N°. Permiso: ' + this.datoSolicitud[0].num_permiso, style: 'itemsTableD' }] }
              ]
            }],
            [{ text: 'MOTIVO', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'TIPO DE SOLICITUD: ' + this.datoSolicitud[0].nom_permiso, style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'FECHA DE INICIO: ' + this.datoSolicitud[0].fec_inicio.split('T')[0], style: 'itemsTableD' }] },]
            }],
            [{
              columns: [
                { text: [{ text: 'OBSERVACIÓN: ' + this.datoSolicitud[0].descripcion, style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'FECHA DE FINALIZACIÓN: ' + this.datoSolicitud[0].fec_final.split('T')[0], style: 'itemsTableD' }] },
              ]
            }],
            [{
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
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 2].estado.toUpperCase() + ' POR', style: 'tableHeaderA' },],
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },],
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 2].e_nombre + ' ' + this.datosEmpleadoAutoriza[this.cont - 2].e_apellido + '\n' + this.datosEmpleadoAutoriza[this.cont - 2].cargo, style: 'itemsTable' },]
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
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 1].estado.toUpperCase() + ' POR', style: 'tableHeaderA' },],
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },],
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 1].e_nombre + ' ' + this.datosEmpleadoAutoriza[this.cont - 1].e_apellido + '\n' + this.datosEmpleadoAutoriza[this.cont - 1].cargo, style: 'itemsTable' },]
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
                          [{ text: 'EMPLEADO', style: 'tableHeaderA' },],
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] },],
                          [{ text: this.datoSolicitud[0].nombre_emple + ' ' + this.datoSolicitud[0].apellido_emple + '\n' + this.datoSolicitud[0].cargo, style: 'itemsTable' },]
                        ]
                      }
                    },
                    { width: '*', text: '' },
                  ]
                }
              ]
            }],
          ]
        },
        layout: {
          hLineColor: function (i: number, node: { table: { body: string | any[]; }; }) {
            return (i === 0 || i === node.table.body.length) ? 'rgb(80,87,97)' : 'rgb(80,87,97)';
          },
          paddingLeft: function (i: any, node: any) { return 40; },
          paddingRight: function (i: any, node: any) { return 40; },
          paddingTop: function (i: any, node: any) { return 10; },
          paddingBottom: function (i: any, node: any) { return 10; }
        }
      };
    }
  }

}
