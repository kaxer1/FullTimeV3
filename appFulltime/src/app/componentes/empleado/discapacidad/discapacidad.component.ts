import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';

@Component({
  selector: 'app-discapacidad',
  templateUrl: './discapacidad.component.html',
  styleUrls: ['./discapacidad.component.css']
})
export class DiscapacidadComponent implements OnInit {

  public nuevoCarnetForm = new FormGroup({
    carnetForm: new FormControl('', Validators.required),
    porcentajeForm: new FormControl('', Validators.required),
    tipoForm: new FormControl('', Validators.required),
  });
  
  constructor(
    private rest: DiscapacidadService
  ) { }

  ngOnInit(): void {
    this.nuevoCarnetForm.setValue({
      carnetForm: '',
      porcentajeForm: '',
      tipoForm: '',
    });
  }

  insertarCarnet(form){
    let dataCarnet = {
      id_empleado: 3,
      carnet_conadis: form.carnetForm,
      porcentaje: form.porcentajeForm,
      tipo: form.tipoForm,
    }

    this.rest.postDiscapacidadRest(dataCarnet)
    .subscribe(response => {
      console.log(response);
    },
    error => {
      console.log(error);
    });
  }

}
