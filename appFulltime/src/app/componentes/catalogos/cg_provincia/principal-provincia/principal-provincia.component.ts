import { Component, OnInit } from '@angular/core';
import {ProvinciaService} from '../../../../servicios/catalogos/provincia.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-principal-provincia',
  templateUrl: './principal-provincia.component.html',
  styleUrls: ['./principal-provincia.component.css']
})
export class PrincipalProvinciaComponent implements OnInit {

  provincias: any = [];
  constructor(
    public rest: ProvinciaService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getProvincias();
  }

  getProvincias() {
    this.provincias = [];

    this.rest.getProvinciasRest().subscribe(data => {
      console.log(data);
      this.provincias = data
    })
      
    
  }

  getOneProvincia(id:number) {
    this.rest.getOneProvinciaRest(id).subscribe(data => {
      this.provincias = data;

     })
    
  }


  postProvincia(form) {
    let dataProvincia= {
      nombre: form.nombre
    };

    this.rest.postProvinciaRest(dataProvincia).subscribe(
        response => {
          
          console.log(response);
          console.log("GUARDADO CON ÈXITO");
        },
        error => {
          console.log(error);
          
        });

    

  }
}
