import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { HoraExtraAutorizacionesComponent } from '../../autorizaciones/hora-extra-autorizaciones/hora-extra-autorizaciones.component';
import { EditarEstadoHoraExtraAutorizacionComponent } from '../../autorizaciones/editar-estado-hora-extra-autorizacion/editar-estado-hora-extra-autorizacion.component';
import { EstadoHoraExtraComponent } from "../estado-hora-extra/estado-hora-extra.component";
import { TiempoAutorizadoComponent } from '../tiempo-autorizado/tiempo-autorizado.component';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { DatosGeneralesService } from 'src/app/servicios/datosGenerales/datos-generales.service';

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
  HabilitarTiempo: boolean = true;
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
    public restEmpre: EmpresaService,
    public restGeneral: DatosGeneralesService,
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
    this.ObtenerLogo();
    this.ObtnerColores();
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
      if (this.hora_extra[0].tiempo_autorizado === null) {
        this.HabilitarTiempo = false;
      }

      this.id_usua_solicita = this.hora_extra[0].id_usua_solicita;
      this.restA.getUnaAutorizacionByHoraExtraRest(this.dataParams.id).subscribe(res1 => {
        console.log(res1);
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
    this.restHE.BuscarDatosSolicitud(id).subscribe(data => {
      this.datoSolicitud = data;
      console.log('datos solicitud', this.datoSolicitud);
    })
  }

  // Método para ver la información de la autorización 
  consulta: any = [];
  datosEmpleadoAutoriza: any = [];
  cont: number;
  ObtenerAutorizacion(id: any) {
    console.log('entra')
    this.datosAutorizacion = [];
    this.datosEmpleadoAutoriza = [];
    this.restHE.BuscarDatosAutorizacion(id).subscribe(data => {
      this.datosAutorizacion = data;
      console.log('autorizacion', this.datosAutorizacion);
      var autorizaciones = this.datosAutorizacion[0].empleado_estado.split(',');
      console.log('tamaño', autorizaciones.length, ' cadena ', autorizaciones);

      autorizaciones.map(obj => {
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
          this.restGeneral.AutorizaEmpleado(empleado_id).subscribe(dataE => {
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

  AbrirAutorizaciones(datosHoraExtra, nombre) {
    this.vistaFolante.open(HoraExtraAutorizacionesComponent, { width: '300px', 
    data: {pedido_hora: datosHoraExtra, carga: nombre} }).afterClosed().subscribe(items => {
      this.BuscarInfo();
      this.HabilitarAutorizacion = true;
    });
  }

  AbrirTiempoAutorizacion(num_hora, id_hora, id_usua_solicita, datos) {
    let h = {
      id_hora: id_hora,
      hora: num_hora,
      id_empl_solicita: id_usua_solicita
    }
    this.vistaFolante.open(TiempoAutorizadoComponent, {
      width: '300px',
      data: { horas_calculadas: h, pagina: 'solicitud_hora_extra' }
    }).afterClosed().subscribe(items => {
      if (items === true) {
        this.AbrirAutorizaciones(datos, 'individual');
      } else {
        window.location.reload();
      }
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
    var fecha
    var f = moment();
    fecha = f.format('YYYY-MM-DD');
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
      header: { text: 'Impreso por:  ' + this.empleado[0].nombre + ' ' + this.empleado[0].apellido, margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage, pageCount, fecha) {
        var f = moment();
        fecha = f.format('YYYY-MM-DD');

        var h = new Date();
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
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            {
              text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ], fontSize: 10
        }
      },
      content: [
        {image: this.logo, width: 150, margin: [10, -25, 0, 5] },
        { text: this.datoSolicitud[0].nom_empresa.toUpperCase(), bold: true, fontSize: 25, alignment: 'center', margin: [0, -30, 0, 10]},
        { text: 'SOLICITUD DE HORAS EXTRAS', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 10] },
        this.SeleccionarMetodo(this.ObtenerFecha()),
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color, },
        tableHeaderA: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.s_color, margin: [20, 0, 20, 0], },
        itemsTableD: { fontSize: 10, alignment: 'left', margin: [50, 5, 5, 5] },
        itemsTable: { fontSize: 10, alignment: 'center', }
      }
    };
  }

  SeleccionarMetodo(f) {
    if (this.cont === 1) {
      return {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'INFORMACIÓN GENERAL', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'FECHA: ' + f, style: 'itemsTableD' }] },
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
                { text: [{ text: 'SUCURSAL: ' + this.datoSolicitud[0].nom_sucursal, style: 'itemsTableD' }] },
                { text: [{ text: 'CARGO: ' + this.datoSolicitud[0].cargo, style: 'itemsTableD' }] },
              ]
            }],
            [{ text: 'HORAS EXTRAS', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'DESCRIPCIÓN: ' + this.datoSolicitud[0].descripcion, style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'FECHA DE INICIO: ' + this.datoSolicitud[0].fec_inicio.split('T')[0], style: 'itemsTableD' }] },]
            }],
            [{
              columns: [
                { text: [{ text: 'TOTAL HORAS EXTRAS: ' + this.datoSolicitud[0].num_hora + ' horas', style: 'itemsTableD' }] },
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
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 1].estado.toUpperCase() + ' POR', style: 'tableHeaderA' }],
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] }],
                          [{ text: this.datosEmpleadoAutoriza[this.cont - 1].e_nombre + ' ' + this.datosEmpleadoAutoriza[this.cont - 1].e_apellido + '\n' + this.datosEmpleadoAutoriza[this.cont - 1].cargo, style: 'itemsTable' }]
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
                          [{ text: ' ', style: 'itemsTable', margin: [0, 20, 0, 20] }],
                          [{ text: this.datoSolicitud[0].nombre_emple + ' ' + this.datoSolicitud[0].apellido_emple + '\n' + this.datoSolicitud[0].cargo, style: 'itemsTable' }]
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
    else {
      return {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'INFORMACIÓN GENERAL', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'FECHA: ' + f, style: 'itemsTableD' }] },
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
                { text: [{ text: 'SUCURSAL: ' + this.datoSolicitud[0].nom_sucursal, style: 'itemsTableD' }] },
                { text: [{ text: 'CARGO: ' + this.datoSolicitud[0].cargo, style: 'itemsTableD' }] },
              ]
            }],
            [{ text: 'HORAS EXTRAS', style: 'tableHeader' }],
            [{
              columns: [
                { text: [{ text: 'DESCRIPCIÓN: ' + this.datoSolicitud[0].descripcion, style: 'itemsTableD' }] },
                { text: [{ text: '', style: 'itemsTableD' }] },
                { text: [{ text: 'FECHA DE INICIO: ' + this.datoSolicitud[0].fec_inicio.split('T')[0], style: 'itemsTableD' }] },]
            }],
            [{
              columns: [
                { text: [{ text: 'TOTAL HORAS EXTRAS: ' + this.datoSolicitud[0].num_hora + ' horas', style: 'itemsTableD' }] },
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

}
