import { Component, OnInit } from '@angular/core';
import { EnroladoService } from 'src/app/servicios/catalogos/enrolado.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroEnroladosComponent } from '../registro-enrolados/registro-enrolados.component';

@Component({
  selector: 'app-principal-enrolados',
  templateUrl: './principal-enrolados.component.html',
  styleUrls: ['./principal-enrolados.component.css']
})
export class PrincipalEnroladosComponent implements OnInit {

  enrolados: any = [];
 
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
    this.vistaRegistrarEnrolado.open(RegistroEnroladosComponent, { width: '350px' });
  }
    
}