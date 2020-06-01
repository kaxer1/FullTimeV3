import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { DetallePlanHorarioService } from 'src/app/servicios/horarios/detallePlanHorario/detalle-plan-horario.service';
import { EmpleadoProcesosService } from 'src/app/servicios/empleado/empleadoProcesos/empleado-procesos.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { ScriptService } from 'src/app/servicios/empleado/script.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { AutorizaDepartamentoService } from 'src/app/servicios/autorizaDepartamento/autoriza-departamento.service';

import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from 'src/app/componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroEmpleadoPermisoComponent } from 'src/app/componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { CambiarContrasenaComponent } from 'src/app/componentes/rolEmpleado/cambiar-contrasena/cambiar-contrasena.component';

@Component({
  selector: 'app-datos-empleado',
  templateUrl: './datos-empleado.component.html',
  styleUrls: ['./datos-empleado.component.css']
})
export class DatosEmpleadoComponent implements OnInit {

  iniciales: string;
  urlImagen: any;
  mostrarImagen: boolean = false;
  mostrarIniciales: boolean = false;
  barraDis = false;

  empleadoUno: any = [];
  idEmpleado: string;
  fechaNacimiento: any = [];
  discapacidadUser: any = [];

  relacionTituloEmpleado: any = [];
  auxRestTitulo: any = [];

  idContrato: any = [];
  contratoEmpleadoRegimen: any = [];
  contratoEmpleado: any = [];
  fechaContratoIngreso: string;
  fechaContratoSalida: string;

  fechaCargoInicio: string;
  fechaCargoFinal: string;

  logo: any;
  idCargo: any = [];
  idPerVacacion: any = [];
  idPlanHorario: any = [];
  cont: number;

  /* Items de paginación de la tabla */
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public restTitulo: TituloService,
    public restEmpleado: EmpleadoService,
    public restDiscapacidad: DiscapacidadService,
    public restCargo: EmplCargosService,
    public restPerV: PeriodoVacacionesService,
    public restPlanH: PlanHorarioService,
    public vistaRegistrarDatos: MatDialog,
    public restVacaciones: VacacionesService,
    public restPlanHoraDetalle: DetallePlanHorarioService,
    public restEmpleadoProcesos: EmpleadoProcesosService,
    public restPlanComidas: PlanComidasService,
    public restEmpleHorario: EmpleadoHorariosService,
    public restPermiso: PermisosService,
    public restAutoridad: AutorizaDepartamentoService,
    private toastr: ToastrService,
    private scriptService: ScriptService
  ) {
    this.idEmpleado = localStorage.getItem('empleado');
    this.obtenerTituloEmpleado(parseInt(this.idEmpleado));
    this.obtenerDiscapacidadEmpleado(this.idEmpleado);
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit(): void {
    this.verEmpleado(this.idEmpleado);
    this.obtenerContratoEmpleadoRegimen();
    this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
    this.obtenerPermisos(parseInt(this.idEmpleado))
    this.ObtenerAutorizaciones(parseInt(this.idEmpleado));
    this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  /* 
  ****************************************************************************************************
  *                               LECTURA DE DATOS
  ****************************************************************************************************
  */

  /* Método para ver la información del empleado */
  textoBoton: string = 'Subir Foto';
  verEmpleado(idemploy: any) {
    this.empleadoUno = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      this.fechaNacimiento = data[0]['fec_nacimiento'].split("T")[0];
      if (data[0]['imagen'] != null) {
        this.urlImagen = 'http://localhost:3000/empleado/img/' + data[0]['imagen'];
        this.mostrarImagen = true;
        this.mostrarIniciales = false;
        this.textoBoton = 'Editar Foto';
      } else {
        this.iniciales = data[0].nombre.split(" ")[0].slice(0, 1) + data[0].apellido.split(" ")[0].slice(0, 1);
        this.mostrarIniciales = true
        this.mostrarImagen = false;
        this.textoBoton = 'Subir Foto';
      }
    })
  }

  /* Método para obtener datos de discapacidad */
  obtenerDiscapacidadEmpleado(idEmployDisca: any) {
    this.discapacidadUser = [];
    this.restDiscapacidad.getDiscapacidadUsuarioRest(idEmployDisca).subscribe(data => {
      this.discapacidadUser = data;
    }, error => { console.log("") });
  }

  /* Método para obtener los títulos de un empleado a través de la tabla EMPL_TITULOS 
   * que conecta a la tabla EMPLEADOS con CG_TITULOS */
  obtenerTituloEmpleado(idEmployTitu: number) {
    this.relacionTituloEmpleado = [];
    this.restEmpleado.getEmpleadoTituloRest(idEmployTitu).subscribe(data => {
      this.relacionTituloEmpleado = data;
    }, error => { console.log("") });
  }

  /* Método para obtener el contrato de un empleado con su respectivo régimen laboral */
  idContratoEmpleado: number;
  obtenerContratoEmpleadoRegimen() {
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleadoRegimen = res;
    }, error => { console.log("") });
    this.restEmpleado.BuscarContratoIdEmpleado(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleado = res;
      this.contratoEmpleado.forEach(obj => {
        this.obtenerCargoEmpleado(obj.id);
        this.obtenerPeriodoVacaciones(obj.id);
      });
    }, error => { console.log("") });
  }

  /* Métodos para obtener el cargo del empleado */
  cargoEmpleado: any = [];
  obtenerCargoEmpleado(idContratoEmpleado: number) {
    this.cargoEmpleado = [];
    this.restCargo.getInfoCargoEmpleadoRest(idContratoEmpleado).subscribe(res => {
      console.log(this.cargoEmpleado);
      this.cargoEmpleado.push(res);
      this.cargoEmpleado.forEach(obj => {
        this.obtenerPlanHorarios(obj.id);
        this.obtenerEmpleadoProcesos(obj.id);
      });
    }, error => { console.log("") });
  }

  /* Método para obtener datos del periodo de vacacones */
  peridoVacaciones: any = [];
  obtenerPeriodoVacaciones(idContratoEmpleado: number) {
    this.restPerV.getInfoPeriodoVacacionesPorIdContrato(idContratoEmpleado).subscribe(res => {
      this.peridoVacaciones = res;
      this.peridoVacaciones.map(obj => {
        this.obtenerVacaciones(obj.id);
      });
    }, error => { console.log("") });
  }

  /* Metodo para obtener datos de vacaciones */
  vacaciones: any = [];
  obtenerVacaciones(id_peri_vacaciones: number) {
    this.restVacaciones.ObtenerVacacionesPorIdPeriodo(id_peri_vacaciones).subscribe(res => {
      this.vacaciones = res;
    }, error => { console.log("") });
  }

  /* Método para mostrar los datos de la planificación de horarios */
  planHorario: any;
  obtenerPlanHorarios(idEmpleadoCargo: number) {
    this.restPlanH.ObtenerPlanHorarioPorIdCargo(idEmpleadoCargo).subscribe(res => {
      this.planHorario = res;
      this.planHorario.map(obj => {
        this.obtenerPlanHoraDetalle(obj.id);
      })
    }, error => { console.log("") });
  }

  /* Método para mostrar datos del detalle de horarios */
  planHoraDetalle: any;
  obtenerPlanHoraDetalle(id_plan_horario: number) {
    this.restPlanHoraDetalle.ObtenerPlanHoraDetallePorIdPlanHorario(id_plan_horario).subscribe(res => {
      this.planHoraDetalle = res;
    }, error => { console.log("") });
  }

  /* Método para mostrar datos de procesos del empleado */
  empleadoProcesos: any;
  obtenerEmpleadoProcesos(idEmpleadoCargo: number) {
    this.restEmpleadoProcesos.ObtenerProcesoPorIdCargo(idEmpleadoCargo).subscribe(res => {
      this.empleadoProcesos = res
    }, error => { console.log("") });
  }

  /* Método para mostrar planificación de comidas */
  planComidas: any;
  obtenerPlanComidasEmpleado(id_empleado: number) {
    this.planComidas = [];
    this.restPlanComidas.obtenerPlanComidaPorIdEmpleado(id_empleado).subscribe(res => {
      this.planComidas = res
    }, error => { console.log("") });
  }

  /* Método para imprimir datos del permiso */
  permisosEmpleado: any;
  permisosTotales: any;
  obtenerPermisos(id_empleado: number) {
    this.cont = 0;
    this.permisosEmpleado = [];
    this.permisosTotales = [];
    this.restEmpleado.BuscarIDContrato(id_empleado).subscribe(datos => {
      this.idContrato = datos;
      console.log("idContrato ", this.idContrato[0].id);
      for (let i = 0; i <= this.idContrato.length - 1; i++) {
        this.restPermiso.BuscarPermisoContrato(this.idContrato[i]['id']).subscribe(datos => {
          this.permisosEmpleado = datos;
          if (this.permisosEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.permisosTotales = datos
              this.cont++;
            }
            else {
              this.permisosTotales = this.permisosTotales.concat(datos);
              console.log("Datos Permisos" + i + '', this.permisosTotales)
            }
          }
        })
      }
    });
  }

  /* Método para mostrar datos de autoridad departamentos */
  autorizacionEmpleado: any;
  autorizacionesTotales: any;
  ObtenerAutorizaciones(id_empleado: number) {
    this.autorizacionEmpleado = [];
    this.autorizacionesTotales = [];
    this.cont = 0;
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      console.log("idCargo ", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restAutoridad.BuscarAutoridadCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.autorizacionEmpleado = datos;
          if (this.autorizacionEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.autorizacionesTotales = datos
              this.cont++;
            }
            else {
              this.autorizacionesTotales = this.autorizacionesTotales.concat(datos);
              console.log("Datos autorizacion" + i + '', this.autorizacionesTotales)
            }
          }
        })
      }
    });
  }

  /* Método para mostrar datos de horario */
  horariosEmpleado: any;
  horariosEmpleadoTotales: any = [];
  ObtenerHorariosEmpleado(id_empleado: number) {
    this.horariosEmpleado = [];
    this.horariosEmpleadoTotales = [];
    this.cont = 0;
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      console.log("idCargo ", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restEmpleHorario.BuscarHorarioCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.horariosEmpleado = datos;
          if (this.horariosEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.horariosEmpleadoTotales = datos
              this.cont++;
            }
            else {
              this.horariosEmpleadoTotales = this.horariosEmpleadoTotales.concat(datos);
              console.log("Datos autorizacion" + i + '', this.horariosEmpleadoTotales)
            }
          }
        })
      }
    });
  }

  /* 
  ****************************************************************************************************
  *                               ABRIR VENTANAS DE SOLICITUDES
  ****************************************************************************************************
  */

  /* Ventana para ingresar planificación de comidas */
  CambiarContrasena(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(CambiarContrasenaComponent, { width: '350px', data: this.idEmpleado }).disableClose = true;
  }

  /* Ventana para ingresar planificación de comidas */
  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado }).afterClosed().subscribe(item => {
      this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
    });
  }

  /* Ventana para registrar vacaciones del empleado */
  AbrirVentanaVacaciones(): void {
    this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPerVacacion = datos;
      console.log("idPerVaca ", this.idPerVacacion[0].id)
      this.vistaRegistrarDatos.open(RegistrarVacacionesComponent,
        { width: '900px', data: { idEmpleado: this.idEmpleado, idPerVacacion: this.idPerVacacion[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
    });
  }

  /* Ventana para registrar planificación de horarios del empleado */
  AbrirVentanaPlanHorario(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistroPlanHorarioComponent,
        { width: '300px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  /* Ventana para registrar permisos del empleado */
  AbrirVentanaPermiso(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idContrato ", this.idContrato[0].id)
      this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idPerVacacion = datos;
        console.log("idPerVaca ", this.idPerVacacion[0].id)
        this.vistaRegistrarDatos.open(RegistroEmpleadoPermisoComponent,
          {
            width: '1200px',
            data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id, idPerVacacion: this.idPerVacacion[0].id }
          }).afterClosed().subscribe(item => {
            this.obtenerPermisos(parseInt(this.idEmpleado));
          });
      }, error => {
        this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  /* 
  ****************************************************************************************************
  *                               PARA LA GENERACION DE PDFs
  ****************************************************************************************************
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
    sessionStorage.setItem('profile', this.empleadoUno);
    return {
      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [
          { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
          { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ]
      },
      content: [
        // this.logoEmplesa(),
        {
          text: 'Perfil Empleado',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            [{
              text: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido,
              style: 'name'
            },
            {
              text: 'Fecha Nacimiento: ' + this.fechaNacimiento
            },
            {
              text: 'Corre Electronico: ' + this.empleadoUno[0].correo,
            },
            {
              text: 'Teléfono: ' + this.empleadoUno[0].telefono,
            }
            ]
          ]
        },
        {
          text: 'Contrato Empleado',
          style: 'header'
        },
        this.presentarDataPDFcontratoEmpleado(),
        {
          text: 'Plan de comidas',
          style: 'header'
        },
        // this.presentarDataPDFplanComidas(),
        {
          text: 'Titulos',
          style: 'header'
        },
        this.presentarDataPDFtitulosEmpleado(),
        {
          text: 'Discapacidad',
          style: 'header'
        },
        this.presentarDataPDFdiscapacidadEmpleado(),
      ],
      info: {
        title: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido + '_PERFIL',
        author: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido,
        subject: 'Perfil',
        keywords: 'Perfil, Empleado',
      },
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
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
          alignment: 'center',
          fillColor: '#6495ED'
        }
      }
    };
  }

  presentarDataPDFtitulosEmpleado() {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [
          [{
            text: 'Observaciones',
            style: 'tableHeader'
          },
          {
            text: 'Nombre',
            style: 'tableHeader'
          },
          {
            text: 'Nivel',
            style: 'tableHeader'
          }
          ],
          ...this.relacionTituloEmpleado.map(obj => {
            return [obj.observaciones, obj.nombre, obj.nivel];
          })
        ]
      }
    };
  }

  presentarDataPDFcontratoEmpleado() {
    return {
      table: {
        widths: ['*', 'auto', 100, '*'],
        body: [
          [{
            text: 'Descripción',
            style: 'tableHeader'
          },
          {
            text: 'Dias Vacacion',
            style: 'tableHeader'
          },
          {
            text: 'Fecha Ingreso',
            style: 'tableHeader'
          },
          {
            text: 'Fecha Salida',
            style: 'tableHeader'
          }
          ],
          ...this.contratoEmpleadoRegimen.map(obj => {
            const ingreso = obj.fec_ingreso.split("T")[0];
            if (obj.fec_salida === null) {
              const salida = '';
              return [obj.descripcion, obj.dia_anio_vacacion, ingreso, salida];
            } else {
              const salida = obj.fec_salida.split("T")[0];
              return [obj.descripcion, obj.dia_anio_vacacion, ingreso, salida];
            }
          })
        ]
      }
    };

  }

  presentarDataPDFdiscapacidadEmpleado() {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [
          [{
            text: 'Carnet conadis',
            style: 'tableHeader'
          },
          {
            text: 'Porcentaje',
            style: 'tableHeader'
          },
          {
            text: 'Tipo',
            style: 'tableHeader'
          }
          ],
          ...this.discapacidadUser.map(obj => {
            return [obj.carn_conadis, obj.porcentaje + ' %', obj.tipo];
          })
        ]
      }
    };
  }

  presentarDataPDFplanComidas() {

  }

  logoEmplesa() {
    this.getBase64();
    if (this.logo) {
      return {
        image: this.logo,
        width: 110,
        alignment: 'right'
      };
    }
    return null;
  }

  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64();
  }

  getBase64() {
    const reader = new FileReader();
    reader.readAsDataURL(this.urlImagen);
    reader.onload = () => {
      // console.log(reader.result);
      this.logo = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  /* 
  ****************************************************************************************************
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL Y CSV
  ****************************************************************************************************
  */

  exportToExcel() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleadoUno);
    const wsc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.contratoEmpleadoRegimen);
    const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relacionTituloEmpleado);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'perfil');
    xlsx.utils.book_append_sheet(wb, wsc, 'contrato');
    xlsx.utils.book_append_sheet(wb, wst, 'titulos');
    xlsx.utils.book_append_sheet(wb, wsd, 'discapacida');
    xlsx.writeFile(wb, "EmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

  exportToCVS() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleadoUno);
    const wsc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.contratoEmpleadoRegimen);
    const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relacionTituloEmpleado);
    const csvDataE = xlsx.utils.sheet_to_csv(wse);
    const csvDataC = xlsx.utils.sheet_to_csv(wsc);
    const csvDataD = xlsx.utils.sheet_to_csv(wsd);
    const csvDataT = xlsx.utils.sheet_to_csv(wst);
    const data: Blob = new Blob([csvDataE, csvDataC, csvDataD, csvDataT], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpleadoCSV" + new Date().getTime() + '.csv');
  }

  /* 
  ****************************************************************************************************
  *                               PARA LA SUBIR LA IMAGEN DEL EMPLEADO
  ****************************************************************************************************
  */
  nameFile: string;
  archivoSubido: Array<File>;
  archivoForm = new FormControl('');

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.plantilla();
  }

  plantilla() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      console.log(this.archivoSubido[i], this.archivoSubido[i].name)
      formData.append("image[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.restEmpleado.subirImagen(formData, parseInt(this.idEmpleado)).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'imagen subida.');
      this.verEmpleado(this.idEmpleado)
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }


}