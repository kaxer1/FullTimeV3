import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../servicios/roles/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroRolComponent } from '../registro-rol/registro-rol.component';
import { FormControl, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css']
})
export class VistaRolesComponent implements OnInit {

  roles: any = [];
  filtroRoles = '';

  buscarDescripcion = new FormControl('', Validators.required);

  constructor(
    private rest: RolesService,
    public vistaRegistrarRol: MatDialog,
  ) {
    this.obtenerRoles();
   }

  ngOnInit() {
    
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
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
    this.vistaRegistrarRol.open(RegistroRolComponent, { width: '300px' })
  }

  limpiarCampoBuscar(){
    this.buscarDescripcion.reset();
  }
}
