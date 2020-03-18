import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../servicios/roles/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroRolComponent } from '../registro-rol/registro-rol.component';
@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css']
})
export class VistaRolesComponent implements OnInit {

  roles: any = [];

  constructor(
    private rest: RolesService,
    public vistaRegistrarRol: MatDialog,
  ) { }

  ngOnInit() {
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

}
