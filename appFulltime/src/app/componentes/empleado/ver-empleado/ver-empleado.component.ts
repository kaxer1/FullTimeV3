import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';

import { RegistroContratoComponent } from 'src/app/componentes/empleadoContrato/registro-contrato/registro-contrato.component'
import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component'
import { EmplCargosComponent } from 'src/app/componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { ScriptService } from 'src/app/servicios/empleado/script.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as xlsx from 'xlsx';

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

  constructor(
    public restEmpleado: EmpleadoService,
    public restDiscapacidad: DiscapacidadService,
    public restTitulo: TituloService,
    public vistaRegistrarContrato: MatDialog,
    public vistaRegistrarPlanificacion: MatDialog,
    public vistaRegistrarCargoEmpeado: MatDialog,
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
      console.log("idcargo ",this.idContrato[0].id)
      this.vistaRegistrarCargoEmpeado.open(EmplCargosComponent, { width: '900px', data:{ idEmpleado: this.idEmpleado, idContrato: this.idContrato[0].id}  }).disableClose = true;
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Contrato', 'Primero Registrar Contrato')
    });

  }

  // PARA LA GENERACION DE PDFs
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

  // *********************************************************************

   exportToExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'InfoEmpleado.xlsx');
  }

  exportToCVS(){
    const hoja: xlsx.WorkSheet = xlsx.utils.json_to_sheet(this.discapacidadUser);
    const ws = xlsx.utils.sheet_to_csv(hoja);
    console.log(ws);
    // const wb: xlsx.WorkBook = xlsx.utils.book_new();

  }

}
