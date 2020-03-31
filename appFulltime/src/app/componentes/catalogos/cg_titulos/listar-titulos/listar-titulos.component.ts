import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitulosComponent } from '../titulos/titulos.component'
import { TituloService } from 'src/app/servicios/catalogos/titulo.service';

interface Nivel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-listar-titulos',
  templateUrl: './listar-titulos.component.html',
  styleUrls: ['./listar-titulos.component.css']
})
export class ListarTitulosComponent implements OnInit {

  titulos: any = [];
  verTitulos: any = [];

  niveles: Nivel[] = [
    {value: '1', viewValue: 'Educación Básica'},
    {value: '2', viewValue: 'Bachillerato'},
    {value: '3', viewValue: 'Técnico Superior'},
    {value: '4', viewValue: 'Tercer Nivel'},
    {value: '5', viewValue: 'Postgrado'}
  ];

  constructor(
    public vistaRegistrarTitulo: MatDialog,
    public rest: TituloService
  ) { }

  ngOnInit(): void {
    this.ObtenerTitulos();
  }

  ObtenerTitulos(){
    this.rest.getTituloRest().subscribe(data => {
      this.titulos = data;
      this.titulos.forEach(obj => {
        this.niveles.forEach(niv => {

          if(niv.value == obj.nivel){
            let dataTitulos = {
              id: obj.id,
              nombre: obj.nombre,
              nivel: niv.viewValue
            }
            this.verTitulos.push(dataTitulos);
          }
          
        })
      })
    });
  }

  AbrirVentanaRegistrarTitulo(): void {
    this.vistaRegistrarTitulo.open(TitulosComponent, { width: '300px' }).disableClose = true;
  }

  LimpiarCampos() {
    console.log('limpiar');
  }
}
