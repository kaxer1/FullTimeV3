import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';
import { RegistrarFeriadosComponent } from 'src/app/componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';
import { EditarFeriadosComponent } from 'src/app/componentes/catalogos/catFeriados/editar-feriados/editar-feriados.component';
import { AsignarCiudadComponent } from 'src/app/componentes/catalogos/catFeriados/asignar-ciudad/asignar-ciudad.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listar-feriados',
  templateUrl: './listar-feriados.component.html',
  styleUrls: ['./listar-feriados.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class ListarFeriadosComponent implements OnInit {

  // Control de campos y validaciones del formulario
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  fechaF = new FormControl('');
  archivoForm = new FormControl('', Validators.required);

  // Asignación de validaciones a inputs del formulario
  public BuscarFeriadosForm = new FormGroup({
    descripcionForm: this.descripcionF,
    fechaForm: this.fechaF,
  });

  // Almacenamiento de datos consultados  
  feriados: any = [];
  filtroDescripcion = '';
  filtradoFecha = '';

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  nameFile: string;
  archivoSubido: Array < File > ;

  constructor(
    private rest: FeriadosService,
    public vistaRegistrarFeriado: MatDialog,
    public vistaAsignarCiudad: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerFeriados();
  }

  // Lectura de datos
  ObtenerFeriados() {
    this.feriados = [];
    this.rest.ConsultarFeriado().subscribe(datos => {
      this.feriados = datos;
      for (let i = this.feriados.length - 1; i >= 0; i--) {
        var cadena1 = this.feriados[i]['fecha'];
        var aux1 = cadena1.split("T");
        this.feriados[i]['fecha'] = aux1[0];
        if (this.feriados[i]['fec_recuperacion'] != null){
          var cadena2 = this.feriados[i]['fec_recuperacion'];
          var aux2 = cadena2.split("T");
          this.feriados[i]['fec_recuperacion'] = aux2[0];
        }
      }
    })
  }

  AbrirVentanaRegistrarFeriado(): void {
    this.vistaRegistrarFeriado.open(RegistrarFeriadosComponent, { width: '400px' }).disableClose = true;
  }

  AbrirVentanaEditarFeriado(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarFeriado.open(EditarFeriadosComponent, { width: '400px', data: { datosFeriado: datosSeleccionados, actualizar: true} }).disableClose = true;
    console.log(datosSeleccionados.fecha);
  }

  AbrirVentanaAsignarCiudad(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaAsignarCiudad.open(AsignarCiudadComponent, { width: '600px', data: { feriado: datosSeleccionados, actualizar: false} }).disableClose = true;
    console.log(datosSeleccionados.fecha);
  }

  LimpiarCampos() {
    this.BuscarFeriadosForm.setValue({
      descripcionForm: '',
      fechaForm: ''
    });
    this.ObtenerFeriados();
  }

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

  ObtenerMensajeDescripcionLetras() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ManejarPagina(e: PageEvent){
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems =  this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0,8);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'feriados') {
        this.plantilla();
      } else {
        this.toastr.error('Solo se acepta Feriados', 'Plantilla seleccionada incorrecta');
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
      this.toastr.success('Operación Exitosa', 'Plantilla de Feriados importada.');
      this.ObtenerFeriados();
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }
}