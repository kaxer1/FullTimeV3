import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';

import { RegistroContratoComponent } from 'src/app/componentes/empleadoContrato/registro-contrato/registro-contrato.component'
import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { EmplCargosComponent } from 'src/app/componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { ScriptService } from 'src/app/servicios/empleado/script.service';

import { RegistrarPeriodoVComponent } from 'src/app/componentes/periodoVacaciones/registrar-periodo-v/registrar-periodo-v.component';
import { RegistrarEmpleProcesoComponent } from 'src/app/componentes/empleadoProcesos/registrar-emple-proceso/registrar-emple-proceso.component';
import { RegistrarVacacionesComponent } from 'src/app/componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from 'src/app/componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroDetallePlanHorarioComponent } from 'src/app/componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';  

@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})
export class VerEmpleadoComponent implements OnInit {
  empleadoUno: any = [];
  idEmpleado: string;
  editar: string = '';
  fecha: any = [];
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
  contratoEmpleado: any = [];

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
    public vistaRegistrarContrato: MatDialog,
    public vistaRegistrarPlanificacion: MatDialog,
    public vistaRegistrarCargoEmpeado: MatDialog,
    public vistaRegistrarPerVacaciones: MatDialog,
    public vistaRegistrarEmpleProcesos: MatDialog,
    public vistaRegistrarVacaciones: MatDialog,
    public vistaRegistroPlanHorario: MatDialog,
    public vistaRegistroDetallePlanHorario: MatDialog,
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
  }

  onUploadFinish(event) {
    console.log(event);
  }

  // metodo para ver la informacion del empleado 
  verEmpleado(idemploy: any) {
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
      // sacar la fecha del JSON 
      var cadena1 = data[0]['fec_nacimiento'];
      this.fecha = cadena1.split("T")[0];
    })
  }

  // metodo para obtener a los empleados que tengan alguna discapacidad asignada
  obtenerDiscapacidadEmpleado(idEmployDisca: any) {
    this.restDiscapacidad.getDiscapacidadUsuarioRest(idEmployDisca).subscribe(data => {
      this.discapacidadUser = data;
      this.habilitarBtn();
    }, error => { });
  }

  // metodo para obtener los titulos de un empleado a traves de la tabla EMPL_TITULOS que conecta a la tabla EMPLEADOS con CG_TITULOS 
  obtenerTituloEmpleado(idEmployTitu: any) {
    this.relacionTituloEmpleado = [];
    this.restEmpleado.getEmpleadoTituloRest(idEmployTitu).subscribe(data => {
      this.relacionTituloEmpleado = data;
    }, error => { });
  }

  // metodo para obtener el contrato de un empleado con su respectivo regimen laboral
  obtenerContratoEmpleadoRegimen(){
    this.restEmpleado.BuscarContratoEmpleadoRegimen(parseInt(this.idEmpleado)).subscribe(res => {
      this.contratoEmpleado = res;
    })
  }

  // El metodo controla que solo se habilite el boton si no existe un registro de discapacidad, 
  // caso contrario se deshabilita para que no permita mas registros de discapacidad al mismo usuario.
  habilitarBtn() {
    if (this.discapacidadUser.length == 0) {
      this.btnHabilitado = true;
    } else {
      this.btnHabilitado = true;
      this.btnDisc = 'Editar';
      this.mostrarDiscapacidad = true;
    }
  }

  // logica de boton para mostrar componente del registro de discapacidad
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

  // logica de boton para mostrar componente del registro y asignacion de titulo al usuario.
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
    this.vistaRegistrarContrato.open(RegistroContratoComponent, { width: '900px', data: this.idEmpleado }).disableClose = true;
  }

  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarPlanificacion.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado }).disableClose = true;
  }

  AbrirVentanaCargo(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato[0].id)
      this.vistaRegistrarCargoEmpeado.open(EmplCargosComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaPerVacaciones(): void {
    this.restEmpleado.BuscarIDContrato(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idContrato = datos;
      console.log("idcargo ", this.idContrato[0].id)
      this.vistaRegistrarPerVacaciones.open(RegistrarPeriodoVComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });
  }

  AbrirVentanaProcesos(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistrarEmpleProcesos.open(RegistrarEmpleProcesoComponent, { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaVacaciones(): void {
    this.restPerV.BuscarIDPerVacaciones(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPerVacacion = datos;
      console.log("idPerVaca ", this.idPerVacacion[0].id)
      this.vistaRegistrarVacaciones.open(RegistrarVacacionesComponent, { width: '900px', data: { idEmpleado: this.idEmpleado, idPerVacacion: this.idPerVacacion[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Periodo de Vacaciones', 'Primero Registrar Periodo de Vacaciones')
    });
  }

  AbrirVentanaPlanHorario(): void {
    this.restCargo.BuscarIDCargo(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].id)
      this.vistaRegistroPlanHorario.open(RegistroPlanHorarioComponent, { width: '300px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  AbrirVentanaDetallePlanHorario(): void {
    this.restPlanH.BuscarIDPlanHorario(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idPlanHorario = datos;
      console.log("idcargo ", this.idPlanHorario[0].id)
      this.vistaRegistroDetallePlanHorario.open(RegistroDetallePlanHorarioComponent, { width: '350px', data: { idEmpleado: this.idEmpleado, idPlanHorario: this.idPlanHorario[0].id } }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado Planificación de Horario', 'Primero Registrar Planificación de Horario')
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
      header: function(currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [
          { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
          { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
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
              text: 'Fecha Nacimiento: ' + this.fecha
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
        author: this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido ,
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
          ...this.contratoEmpleado.map(obj => {
            const ingreso = obj.fec_ingreso.split("T")[0];
            const salida = obj.fec_salida.split("T")[0];
            return [obj.descripcion, obj.dia_anio_vacacion, ingreso, salida];
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
  
  presentarDataPDFplanComidas(){

  }

  logoEmplesa() {
    if (this.logo) {
      return {
        image: this.logo,
        width: 110,
        alignment : 'right'
      };
    }
    return null;
  }

  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64(file);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
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
  *                               PARA LA EXPORTACION DE ARCHIVOS EXCEL Y CSV
  * 
  * 
  ****************************************************************************************************
  */ 

  // DataGeneral: any = [];

  // datosGenerales(){
    // this.empleadoUno.forEach(obj1 => {
    //   this.DataGeneral.push(obj1);
    //   this.contratoEmpleado.forEach(obj => {
    //     this.DataGeneral.push(obj);
    //   });
    //   this.discapacidadUser.forEach(obj => {
    //     this.DataGeneral.push(obj);
    //   });
    //   this.relacionTituloEmpleado.forEach(obj => {
    //     this.DataGeneral.push(obj);
    //   });
    // });
    // console.log(JSON.stringify( this.DataGeneral));
  // }

  exportToExcel() {
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleadoUno);
    const wsc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.contratoEmpleado);
    const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relacionTituloEmpleado);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, wse, 'perfil');
    xlsx.utils.book_append_sheet(wb, wsc, 'contrato');
    xlsx.utils.book_append_sheet(wb, wst, 'titulos');
    xlsx.utils.book_append_sheet(wb, wsd, 'discapacida');
    xlsx.writeFile(wb, "EmpleadoEXCEL" + new Date().getTime() + '.xlsx');
  }

  exportToCVS(){
    const wse: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.empleadoUno);
    const wsc: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.contratoEmpleado);
    const wsd: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wst: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.relacionTituloEmpleado);
    const csvDataE = xlsx.utils.sheet_to_csv(wse);  
    const csvDataC = xlsx.utils.sheet_to_csv(wsc);  
    const csvDataD = xlsx.utils.sheet_to_csv(wsd);  
    const csvDataT = xlsx.utils.sheet_to_csv(wst);  
    const data: Blob = new Blob([csvDataE,csvDataC,csvDataD,csvDataT], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "EmpleadoCSV" + new Date().getTime() + '.csv');  
  }
}
