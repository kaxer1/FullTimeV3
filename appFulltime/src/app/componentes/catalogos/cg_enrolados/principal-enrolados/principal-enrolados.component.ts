import { Component, OnInit } from '@angular/core';
import { EnroladoService } from 'src/app/servicios/catalogos/enrolado.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroEnroladosComponent } from '../registro-enrolados/registro-enrolados.component';
import { FormControl, Validators } from '@angular/forms';

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
  idUser = new FormControl('', Validators.required);
  nombre = new FormControl('', Validators.required);
  activo = new FormControl('', Validators.required);
  finger = new FormControl('', Validators.required);
 
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

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  limpiarCampos(){
    this.idUser.reset();
    this.nombre.reset();
    this.activo.reset();
    this.finger.reset();
  }
    
}