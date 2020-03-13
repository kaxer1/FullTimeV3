import { Component, OnInit } from '@angular/core';
import { HorarioService } from 'src/app/servicios/catalogos/horario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getHorarios();
  }


  getHorarios() {
    this.horarios = [];

    this.rest.getHorariosRest().subscribe(data => {
      this.horarios = data
    })
      
    
  }

  
}
