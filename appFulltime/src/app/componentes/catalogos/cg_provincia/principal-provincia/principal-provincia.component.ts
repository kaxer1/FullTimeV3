import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from '../../../../servicios/catalogos/provincia.service'
import { MatDialog } from '@angular/material/dialog';
import { RegistroProvinciaComponent } from '../registro-provincia/registro-provincia.component'

@Component({
  selector: 'app-principal-provincia',
  templateUrl: './principal-provincia.component.html',
  styleUrls: ['./principal-provincia.component.css']
})
export class PrincipalProvinciaComponent implements OnInit {

  provincias: any = [];
  constructor(
    public rest: ProvinciaService,
    public vistaRegistrarProvincia: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProvincias();
  }

  getProvincias() {
    this.provincias = [];
    this.rest.getProvinciasRest().subscribe(data => {
      this.provincias = data
    })
  }

  getOneProvincia(id: number) {
    this.rest.getOneProvinciaRest(id).subscribe(data => {
      this.provincias = data;
    })
  }

  postProvincia(form) {
    let dataProvincia = {
      nombre: form.nombre
    };

    this.rest.postProvinciaRest(dataProvincia).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  AbrirVentanaRegistrarProvincia() {
    this.vistaRegistrarProvincia.open(RegistroProvinciaComponent, { width: '300px' })
  }

}
