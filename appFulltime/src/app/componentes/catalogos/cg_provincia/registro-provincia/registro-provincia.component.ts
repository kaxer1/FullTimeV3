import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from 'src/app/servicios/catalogos/provincia.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-provincia',
  templateUrl: './registro-provincia.component.html',
  styleUrls: ['./registro-provincia.component.css']
})
export class RegistroProvinciaComponent implements OnInit {

  nombre = new FormControl('',[ Validators.required, Validators.pattern('[a-zA-ZñÑ ]*')])
  public nuevaProvinciaForm = new FormGroup({
    nombreForm: this.nombre,
  });
  
  constructor(
    private rest: ProvinciaService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  obtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Debe ingresar alguna Provincia';
    }
    return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
  }

  insertarProvincia(form){
    let dataProvincia = {
      nombre: form.nombreForm,
    };

    this.rest.postProvinciaRest(dataProvincia)
    .subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Provincia guardada');
        this.limpiarCampos();
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos(){
    this.nuevaProvinciaForm.reset();
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!((key >= 48 && key <= 63)|| key==8 || key==46))
  }
}
