import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../servicios/roles/roles.service';

@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css']
})
export class VistaRolesComponent implements OnInit {

  roles: any = [];

  constructor(private rolesServicio: RolesService) { }

  ngOnInit() {
    this.rolesServicio.getRoles().subscribe(
      //res => console.log(res),
      res => {
        this.roles = res;
      },
      err => console.error(err)
    );
  }

}
