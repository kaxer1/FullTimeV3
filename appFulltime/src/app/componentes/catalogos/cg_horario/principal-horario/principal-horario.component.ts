import { Component, OnInit } from '@angular/core';
import { HorarioService } from 'src/app/servicios/catalogos/horario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroHorarioComponent } from 'src/app/componentes/catalogos/cg_horario/registro-horario/registro-horario.component';

@Component({
  selector: 'app-principal-horario',
  templateUrl: './principal-horario.component.html',
  styleUrls: ['./principal-horario.component.css']
})
export class PrincipalHorarioComponent implements OnInit {

  horarios: any = [];
  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    private router: Router,
    public vistaRegistrarHorario: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getHorarios();
  }n


  getHorarios() {
    this.horarios = [];

    this.rest.getHorariosRest().subscribe(data => {
      this.horarios = data
    })
      
    
  }

  foo(){
    console.log("hola ")
    //alert("Prueba")
  }

  AbrirVentanaRegistrarHorario(): void {
    this.vistaRegistrarHorario.open(RegistroHorarioComponent, { width: '350px' })
  }

  
}
