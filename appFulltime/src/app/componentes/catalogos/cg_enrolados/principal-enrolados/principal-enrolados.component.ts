import { Component, OnInit } from '@angular/core';
import { EnroladoService } from 'src/app/servicios/catalogos/enrolado.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-enrolados',
  templateUrl: './principal-enrolados.component.html',
  styleUrls: ['./principal-enrolados.component.css']
})
export class PrincipalEnroladosComponent implements OnInit {

  enrolados: any = [];
 
  constructor(
    private rest: EnroladoService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEnrolados();
  }


  getEnrolados() {
    this.enrolados = [];

    this.rest.getEnroladosRest().subscribe(data => {
    
      this.enrolados = data
    })
      
    
  }

  
    
 

  
}