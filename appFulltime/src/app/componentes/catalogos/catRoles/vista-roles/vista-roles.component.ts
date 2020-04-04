import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { RegistroRolComponent } from 'src/app/componentes/catalogos/catRoles/registro-rol/registro-rol.component';

@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css']
})
export class VistaRolesComponent implements OnInit {

  roles: any = [];
  filtroRoles = '';

  buscarDescripcion = new FormControl('', Validators.minLength(2));

  constructor(
    private rest: RolesService,
    private toastr: ToastrService,
    public vistaRegistrarRol: MatDialog,
  ) {
    this.obtenerRoles();
   }

  ngOnInit() {  
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }

  obtenerRoles(){
    this.rest.getRoles().subscribe(
      res => {
        this.roles = res;
      },
      err => console.error(err)
    );
  }

  AbrirVentanaRegistrarRol(){
    this.vistaRegistrarRol.open(RegistroRolComponent, { width: '300px' }).disableClose = true;
  }

  limpiarCampoBuscar(){
    this.buscarDescripcion.reset();
  }
}
