import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from 'src/app/servicios/catalogos/departamento.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroDepartamentoComponent } from 'src/app/componentes/catalogos/cg_departamento/registro-departamento/registro-departamento.component';


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
    private router: Router,
    public vistaRegistrarDepartamento: MatDialog,
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

  AbrirVentanaRegistrarFeriado(): void {
    this.vistaRegistrarDepartamento.open(RegistroDepartamentoComponent, { width: '300px' })
  }
}


