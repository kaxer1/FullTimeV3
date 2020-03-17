import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RolPermisosService } from 'src/app/servicios/catalogos/rol-permisos.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-seleccionar-rol-permiso',
  templateUrl: './seleccionar-rol-permiso.component.html',
  styleUrls: ['./seleccionar-rol-permiso.component.css']
})
export class SeleccionarRolPermisoComponent implements OnInit {

  funcion = new FormControl('', Validators.required);
  link = new FormControl('', Validators.required);
  etiqueta = new FormControl('', Validators.required);

  public nuevoRolPermisoForm = new FormGroup({
    funcionForm: this.funcion,
    linkForm: this.link,
    etiquetaForm: this.etiqueta
  });

  idRol: string;
  idPermiso: string;
  guardarRol: any = [];
  guardarRoles: any = [];
  constructor(
    public location: Location,
    public rest: RolPermisosService
  ) { 
    var url = this.location.prepareExternalUrl(this.location.path());
    var arrayUrl = url.split('/');
    this.idRol = arrayUrl[2];
    console.log(this.idRol);
  }

  ngOnInit(): void {
    this.limpliarCampos();
    this.obtenerRolPermiso();
  }

  limpliarCampos() {
    this.nuevoRolPermisoForm.reset();
  }

  insertarRolPermiso(form){
    let dataRol = {
      funcion: form.funcionForm,
      link: form.linkForm,
      etiqueta: form.etiquetaForm
    }

    this.rest.postRolPermisoRest(dataRol).subscribe(res => {
      // sacar id de la tabla rol permiso
      this.guardarRol = res;
      this.idPermiso = this.guardarRol.id;

      let dataPermisoDenegado = {
        id_rol: this.idRol,
        id_permiso: this.idPermiso
      };

      // insertar id del cg_roles y cg_rol_permiso a la tabla rol_perm_denegado
      this.rest.postPermisoDenegadoRest(dataPermisoDenegado).subscribe(respon => {
        // console.log(respon);
        this.obtenerRolPermiso();
      });
    });

    this.limpliarCampos();
  }
  
  obtenerRolPermiso(){
    this.guardarRoles = [];
    this.rest.getRolPermisoRest().subscribe(data=>{
      this.guardarRoles = data;
      console.log(this.guardarRoles);
    });
  }

}
