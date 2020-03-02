import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/servicios/roles/roles.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TituloService } from 'src/app/servicios/catalogos/titulo.service';

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css']
})
export class TitulosComponent implements OnInit {

  public nuevoTituloForm = new FormGroup({
    // idForm: new FormControl('', Validators.required),
    tituloNombreForm: new FormControl('', Validators.required),
    tituloNivelForm: new FormControl('', Validators.required),
  });

  constructor(
    public rest: TituloService
  ) { 
    this.nuevoTituloForm.setValue({
      tituloNombreForm: '',
      tituloNivelForm: '',
    });
  }

  ngOnInit(): void {
  }

  insertarTitulo(form){
    let dataTitulo = {
      nombre: form.tituloNombreForm,
      nivel: form.tituloNivelForm,
    };

    this.rest.postTituloRest(dataTitulo)
    .subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      });;
  }

}
