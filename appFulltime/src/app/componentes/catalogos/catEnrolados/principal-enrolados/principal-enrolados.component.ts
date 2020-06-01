import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { RegistroEnroladosComponent } from '../registro-enrolados/registro-enrolados.component';
import { EnroladoRelojComponent } from '../enrolado-reloj/enrolado-reloj.component';
import { EnroladoService } from 'src/app/servicios/catalogos/catEnrolados/enrolado.service';
import { EditarEnroladosComponent } from 'src/app/componentes/catalogos/catEnrolados/editar-enrolados/editar-enrolados.component';
import { MetodosComponent } from 'src/app/componentes/metodos/metodos.component';


interface buscarActivo {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-principal-enrolados',
  templateUrl: './principal-enrolados.component.html',
  styleUrls: ['./principal-enrolados.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class PrincipalEnroladosComponent implements OnInit {

  enrolados: any = [];
  idUser = new FormControl('');
  nombre = new FormControl('');
  activo = new FormControl('');
  finger = new FormControl('');

  filtroIdUser: number;
  filtroEnrNombre = '';
  filtroActivo: boolean;
  filtroFinger: number;

  confirmacion = false;

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  activoBus: buscarActivo[] = [
    { value: true, viewValue: 'Activados' },
    { value: false, viewValue: 'Desactivados' }
  ];

  constructor(
    private rest: EnroladoService,
    public vistaRegistrarDatos: MatDialog,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getEnrolados();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  getEnrolados() {
    this.enrolados = [];
    this.rest.getEnroladosRest().subscribe(data => {
      this.enrolados = data
    });
  }

  AbrirVentanaRegistrarEnrolado() {
    this.vistaRegistrarDatos.open(RegistroEnroladosComponent, { width: '600px' }).disableClose = true;
  }

  AbrirVentanaAsignarReloj(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EnroladoRelojComponent, { width: '600px', data: { datosEnrolado: datosSeleccionados, actualizar: false } }).disableClose = true;
    console.log(datosSeleccionados.nombre);
  }

  // Ventana para editar datos
  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarEnroladosComponent, { width: '600px', data: { datosEnrolado: datosSeleccionados, actualizar: false } }).disableClose = true;
  }


  /* **********************************************************************************
   * ELIMAR REGISTRO ENROLADO Y ENROLADOS-DISPOSITIVO 
   * **********************************************************************************/

  /** Función para eliminar registro seleccionado */
  Eliminar(id_enrolado: number) {
    //console.log("probando id", id_enrolado)
    this.rest.EliminarRegistro(id_enrolado).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Registro eliminado');
      this.getEnrolados();
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos): void {
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id);
        } else {
          this.router.navigate(['/enrolados']);
        }
      });
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
    this.idUser.reset();
    this.nombre.reset();
    this.activo.reset();
    this.finger.reset();
  }

  /**
   * Metodos y variables para subir plantilla
   */

  nameFile: string;
  archivoSubido: Array<File>;
  archivoForm = new FormControl('', Validators.required);

  fileChange(element) {
    this.archivoSubido = element.target.files;
    this.nameFile = this.archivoSubido[0].name;
    let arrayItems = this.nameFile.split(".");
    let itemExtencion = arrayItems[arrayItems.length - 1];
    let itemName = arrayItems[0].slice(0, 8);
    console.log(itemName.toLowerCase());
    if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
      if (itemName.toLowerCase() == 'enrolado') {
        this.plantilla();
      } else {
        this.toastr.error('Solo se acepta Enrolados', 'Plantilla seleccionada incorrecta');
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
      this.toastr.success('Operación Exitosa', 'Plantilla de Enrolados importada.');
      this.getEnrolados();
      window.location.reload();
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

}