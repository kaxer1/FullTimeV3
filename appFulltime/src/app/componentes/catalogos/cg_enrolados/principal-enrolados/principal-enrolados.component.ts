import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { RegistroEnroladosComponent } from '../registro-enrolados/registro-enrolados.component';
import { EnroladoService } from 'src/app/servicios/catalogos/enrolado.service';

interface buscarActivo {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-principal-enrolados',
  templateUrl: './principal-enrolados.component.html',
  styleUrls: ['./principal-enrolados.component.css']
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

  activoBus: buscarActivo[] = [
    { value: true, viewValue: 'Activados' },
    { value: false, viewValue: 'Desactivados' }
  ];

  constructor(
    private rest: EnroladoService,
    public vistaRegistrarEnrolado: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getEnrolados();
  }

  getEnrolados() {
    this.enrolados = [];
    this.rest.getEnroladosRest().subscribe(data => {
      this.enrolados = data
    });
  }

  AbrirVentanaRegistrarEnrolado(){
    this.vistaRegistrarEnrolado.open(RegistroEnroladosComponent, { width: '600px' }).disableClose = true;
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

  limpiarCampos(){
    this.idUser.reset();
    this.nombre.reset();
    this.activo.reset();
    this.finger.reset();
  }
    
}