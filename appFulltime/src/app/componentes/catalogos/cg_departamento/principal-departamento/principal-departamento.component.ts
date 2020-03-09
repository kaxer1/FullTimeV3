import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from 'src/app/servicios/catalogos/departamento.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-departamento',
  templateUrl: './principal-departamento.component.html',
  styleUrls: ['./principal-departamento.component.css']
})


export class PrincipalDepartamentoComponent implements OnInit {

  departamentos: any = [];
 
  constructor(
    private rest: DepartamentoService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDepartamentos();
  }


  getDepartamentos() {
    this.departamentos = [];

    this.rest.getDepartamentosRest().subscribe(data => {
    
      this.departamentos = data
    })
      
    
  }

  getOneProvincia(id:number) {
    this.rest.getOneDepartamentoRest(id).subscribe(data => {
      this.departamentos = data;

     })
    
  }


  

  updateDepartamento(id:number) {
    let dataDepartamento ={
      
    }
    this.rest.updateDepartamento(id, dataDepartamento)

  }
}


