import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProcesoService } from 'src/app/servicios/catalogos/proceso.service';

@Component({
  selector: 'app-principal-proceso',
  templateUrl: './principal-proceso.component.html',
  styleUrls: ['./principal-proceso.component.css']
})
export class PrincipalProcesoComponent implements OnInit {

  procesos: any = [];
  constructor(
    private rest: ProcesoService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProcesos();
  }


  getProcesos() {
    this.procesos = [];

    this.rest.getProcesosRest().subscribe(data => {
      console.log(data);
      this.procesos = data
    })
      
    
  }

  getOneProvincia(id:number) {
    this.rest.getOneProcesoRest(id).subscribe(data => {
      this.procesos = data;

     })
    
  }


  postProvincia(form) {
    let dataProvincia= {
      nombre: form.nombre
    };

    this.rest.postProcesoRest(dataProvincia).subscribe(
        response => {
          
          console.log(response);
          console.log("GUARDADO CON ÈXITO");
        },
        error => {
          console.log(error);
          
        });

    

  }
}
