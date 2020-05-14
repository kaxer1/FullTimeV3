import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
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

import { RegistroContratoComponent } from 'src/app/componentes/empleadoContrato/registro-contrato/registro-contrato.component'
import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { EmplCargosComponent } from 'src/app/componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { RegistrarPeriodoVComponent } from 'src/app/componentes/periodoVacaciones/registrar-periodo-v/registrar-periodo-v.component';
import { RegistrarEmpleProcesoComponent } from 'src/app/componentes/empleadoProcesos/registrar-emple-proceso/registrar-emple-proceso.component';
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from 'src/app/componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroDetallePlanHorarioComponent } from 'src/app/componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';
import { RegistroAutorizacionDepaComponent } from 'src/app/componentes/autorizacionDepartamento/registro-autorizacion-depa/registro-autorizacion-depa.component';
import { RegistroEmpleadoPermisoComponent } from 'src/app/componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { RegistoEmpleadoHorarioComponent } from 'src/app/componentes/empleadoHorario/registo-empleado-horario/registo-empleado-horario.component';
import { DetalleCatHorarioComponent } from 'src/app/componentes/catalogos/catHorario/detalle-cat-horario/detalle-cat-horario.component';
import { EditarEmpleadoProcesoComponent } from 'src/app/componentes/empleadoProcesos/editar-empleado-proceso/editar-empleado-proceso.component';

@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})

export class VerEmpleadoComponent implements OnInit {
  empleadoUno: any = [];
  idEmpleado: string;
  editar: string = '';
  fechaNacimiento: any = [];
  mostrarDiscapacidad = true;
  mostrarTitulo = true;
  btnDisc = 'Añadir';
  btnTitulo = 'Añadir';
  discapacidadUser: any = [];

  btnHabilitado = true;
  barraDis = false;

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
    public router: Router,
    private toastr: ToastrService,
    private scriptService: ScriptService
  ) {
    var cadena = this.router.url;
    this.idEmpleado = cadena.split("/")[2];
    this.obtenerTituloEmpleado(this.idEmpleado);
    this.obtenerDiscapacidadEmpleado(this.idEmpleado);
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit(): void {
    this.verEmpleado(this.idEmpleado);
    this.obtenerContratoEmpleadoRegimen();
    this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
  }

  // onUploadFinish(event) {
  //   console.log(event);
  // }

  // Método para ver la información del empleado 
  urlImagen: any;
  iniciales: any;
  mostrarImagen: boolean = false;
  mostrarIniciales: boolean = false;
  textoBoton: string = 'Subir Foto';
  verEmpleado(idemploy: any) {
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      console.log(this.empleadoUno);
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
      this.restEmpleado.obtenerImagen(data[0]['imagen']).subscribe(res => {
        console.log(res);
      })
    })
  }

  // Método para obtener a los empleados que tengan alguna discapacidad asignada
  obtenerDiscapacidadEmpleado(idEmployDisca: any) {
    this.restDiscapacidad.getDiscapacidadUsuarioRest(idEmployDisca).subscribe(data => {
      this.discapacidadUser = data;
      this.habilitarBtn();
    }, error => { });
  }

  // Método para obtener los titulos de un empleado a traves de la tabla EMPL_TITULOS que conecta a la tabla EMPLEADOS con CG_TITULOS 
  obtenerTituloEmpleado(idEmployTitu: any) {
    this.relacionTituloEmpleado = [];
    this.restEmpleado.getEmpleadoTituloRest(idEmployTitu).subscribe(data => {
      this.relacionTituloEmpleado = data;
    }, error => { });
  }

  // metodo para obtener el contrato de un empleado con su respectivo regimen laboral
  idContratoEmpleado: number;
  obtenerContratoEmpleadoRegimen() {
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleadoRegimen = res;
    });
    this.restEmpleado.BuscarContratoIdEmpleado(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleado = res;
      this.contratoEmpleado.map(obj => {
        this.idContratoEmpleado = obj.id;
        this.fechaContratoIngreso = obj.fec_ingreso.split("T")[0];
        if (obj.fec_salida === null) {
          this.fechaContratoSalida = '';
        } else {
          this.fechaContratoSalida = obj.fec_salida.split("T")[0];
        }
        this.obtenerCargoEmpleado();
        this.obtenerPeriodoVacaciones();
      });
    });
  }

  cargoEmpleado: any;
  obtenerCargoEmpleado() {
    this.restCargo.getInfoCargoEmpleadoRest(this.idContratoEmpleado).subscribe(res => {
      this.cargoEmpleado = res;
      this.cargoEmpleado.map(obj => {
        this.obtenerPlanHorarios(obj.id);
        this.obtenerEmpleadoProcesos(obj.id);
      });
    })
  }

  peridoVacaciones: any;
  obtenerPeriodoVacaciones() {
    this.restPerV.getInfoPeriodoVacacionesPorIdContrato(this.idContratoEmpleado).subscribe(res => {
      this.peridoVacaciones = res;
      this.peridoVacaciones.map(obj => {
        this.obtenerVacaciones(obj.id);
      });
    })
  }

  vacaciones: any = [];
  obtenerVacaciones(id_peri_vacaciones: number) {
    this.restVacaciones.ObtenerVacacionesPorIdPeriodo(id_peri_vacaciones).subscribe(res => {
      this.vacaciones = res;
    });
  }

  planHorario: any;
  obtenerPlanHorarios(idEmpleadoCargo: number) {
    this.restPlanH.ObtenerPlanHorarioPorIdCargo(idEmpleadoCargo).subscribe(res => {
      this.planHorario = res;
      this.planHorario.map(obj => {
        this.obtenerPlanHoraDetalle(obj.id);
      })
    });
  }

  planHoraDetalle: any;
  obtenerPlanHoraDetalle(id_plan_horario: number) {
    this.restPlanHoraDetalle.ObtenerPlanHoraDetallePorIdPlanHorario(id_plan_horario).subscribe(res => {
      this.planHoraDetalle = res;
    });
  }

  empleadoProcesos: any;
  obtenerEmpleadoProcesos(idEmpleadoCargo: number) {
    this.restEmpleadoProcesos.ObtenerProcesoPorIdCargo(idEmpleadoCargo).subscribe(res => {
      this.empleadoProcesos = res
    });
  }

  planComidas: any;
  obtenerPlanComidasEmpleado(id_empleado: number) {
    this.restPlanComidas.obtenerPlanComidaPorIdEmpleado(id_empleado).subscribe(res => {
      this.planComidas = res
    })
  }

  // El Método controla que solo se habilite el botón si no existe un registro de discapacidad, 
  // caso contrario se deshabilita para que no permita más registros de discapacidad al mismo usuario.
  habilitarBtn() {
    if (this.discapacidadUser.length == 0) {
      this.btnHabilitado = true;
    } else {
      this.btnHabilitado = true;
      this.btnDisc = 'Editar';
      this.mostrarDiscapacidad = true;
    }
  }

  // Lógica de botón para mostrar componente del registro de discapacidad
  mostrarDis() {
    if (this.btnDisc != 'Editar') {
      if (this.mostrarDiscapacidad == true) {
        this.mostrarDiscapacidad = false;
        this.btnDisc = 'No Añadir';
      } else {
        this.mostrarDiscapacidad = true;
        this.btnDisc = 'Añadir';
      }
    } else {
      this.mostrarDiscapacidad = false;
      this.editar = 'editar';
    }
  }

  // Lógica de botón para mostrar componente del registro y asignación de título al usuario.
  mostrarTit() {
    if (this.mostrarTitulo == true) {
      this.mostrarTitulo = false;
      this.btnTitulo = 'No Añadir'
    } else {
      this.mostrarTitulo = true;
      this.btnTitulo = 'Añadir'
    }
  }

  // Ventana para ingresar contrato del empleado
  AbrirVentanaCrearContrato(): void {
    this.vistaRegistrarDatos.open(RegistroContratoComponent, { width: '900px', data: this.idEmpleado }).disableClose = true;
  }

  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado }).disableClose = true;
  }

  AbrirVentanaCargo(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato[0].id)
      this.vistaRegistrarDatos.open(EmplCargosComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaPerVacaciones(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato[0].id)
      this.vistaRegistrarDatos.open(RegistrarPeriodoVComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaProcesos(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistrarDatos.open(RegistrarEmpleProcesoComponent, { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaVacaciones(): void {
    this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPerVacacion = datos;
      console.log("idPerVaca ", this.idPerVacacion[0].id)
      this.vistaRegistrarDatos.open(RegistrarVacacionesComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idPerVacacion: this.idPerVacacion[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
    });
  }

  AbrirVentanaPlanHorario(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistrarDatos.open(RegistroPlanHorarioComponent, { width: '300px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaDetallePlanHorario(): void {
    this.restPlanH.BuscarIDPlanHorario(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPlanHorario = datos;
      console.log("idcargo ", this.idPlanHorario[0].id)
      this.vistaRegistrarDatos.open(RegistroDetallePlanHorarioComponent, { width: '350px', data: { idEmpleado: this.idEmpleado, idPlanHorario: this.idPlanHorario[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Planificación de Horario', 'Primero Registrar Planificación de Horario')
    });
  }

  // Abrir ventana para determinar si el empleado autoriza dentro del departamento
  AbrirVentanaAutorizar(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistrarDatos.open(RegistroAutorizacionDepaComponent, { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  // Ventana para registra permisos del empleado
  AbrirVentanaPermiso(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idContrato ", this.idContrato[0].id)
      this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
        this.idPerVacacion = datos;
        console.log("idPerVaca ", this.idPerVacacion[0].id)
        this.vistaRegistrarDatos.open(RegistroEmpleadoPermisoComponent, { width: '1200px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id, idPerVacacion: this.idPerVacacion[0].id } }).disableClose = true;
      }, error => {
        this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
      });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaEmplHorario(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistrarDatos.open(RegistoEmpleadoHorarioComponent, { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaCatHorario(): void {
    this.vistaRegistrarDatos.open(DetalleCatHorarioComponent, { width: '600px', data: { ventana: true } }).disableClose = true;
  }

  // Ventana Para editar Procesoso del empleado
  AbrirVentanaEditarProceso(datoSeleccionado: any): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      console.log(datoSeleccionado);
      this.vistaRegistrarDatos.open(EditarEmpleadoProcesoComponent,
        { width: '400px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id, datosProcesos: datoSeleccionado } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });



  }

  /* 
  ****************************************************************************************************
  *
  * 
  *                               PARA LA GENERACION DE PDFs
  * 
  * 
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
        this.logoEmplesa(),
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
  *
  * 
  *                               PARA LA EXPORTACIÓN DE ARCHIVOS EXCEL Y CSV
  * 
  * 
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
  *
  * 
  *                               PARA LA SUBIR LA IMAGEN DEL EMPLEADO
  * 
  * 
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
