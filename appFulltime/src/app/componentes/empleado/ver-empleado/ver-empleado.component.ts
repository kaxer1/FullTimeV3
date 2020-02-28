import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-empleado',
  templateUrl: './ver-empleado.component.html',
  styleUrls: ['./ver-empleado.component.css']
})
export class VerEmpleadoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onUploadFinish(event){
    console.log(event);
  }
}
