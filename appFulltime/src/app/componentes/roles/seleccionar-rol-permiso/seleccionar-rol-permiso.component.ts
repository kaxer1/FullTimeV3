import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RolPermisosService } from 'src/app/servicios/catalogos/rol-permisos.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from '../../../servicios/roles/roles.service';


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
  tableRoles: any = [];
  tablePermios: any = [];
  nombreRol: string;

  constructor(
    public location: Location,
    public rest: RolPermisosService,
    private toastr: ToastrService,
    private rol: RolesService,

  ) { 
    // codigo para obtner el id del rol seleccionado
    var url = this.location.prepareExternalUrl(this.location.path());
    var arrayUrl = url.split('/');
    this.idRol = arrayUrl[2];
    // codigo para obtener el nombre del rol
    this.rol.getOneRol(parseInt(this.idRol)).subscribe(data => {
      this.nombreRol = data[0].nombre;
    })
  }

  ngOnInit(): void {
    this.limpliarCampos();
    this.obtenerPermisosRolUsuario();
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 46) || (key >=48 && key <= 64) ||  (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  limpliarCampos() {
    this.nuevoRolPermisoForm.reset();
  }

  obtenerMensajeErrorFuncion(){
    if (this.funcion.hasError('required')) {
      return 'Debe ingresar alguna Función';
    }
  }

  obtenerMensajeErrorLink(){
    if (this.link.hasError('required')) {
      return 'Debe ingresar alguna Url ';
    }
  }

  obtenerMensajeErrorEtiqueta(){
    if (this.etiqueta.hasError('required')) {
      return 'Debe ingresar alguna etiqueta';
    }
  }

  insertarRolPermiso(form){
    let dataRol = {
      funcion: form.funcionForm,
      link: form.linkForm,
      etiqueta: form.etiquetaForm
    }

    this.rest.postRolPermisoRest(dataRol).subscribe(res => {

      this.toastr.success('Operacion Exitosa', 'Rol Permiso guardado');
      
      // sacar id de la tabla rol permiso
      this.guardarRol = res;
      this.idPermiso = this.guardarRol.id;

      let dataPermisoDenegado = {
        id_rol: this.idRol,
        id_permiso: this.idPermiso
      };

      // insertar id del cg_roles y cg_rol_permiso a la tabla rol_perm_denegado
      this.rest.postPermisoDenegadoRest(dataPermisoDenegado).subscribe(respon => {
        this.obtenerPermisosRolUsuario();
      });
    });

    this.limpliarCampos();
  }

  // metodo para obtener todos los permisos de un solo ROL

  obtenerPermisosRolUsuario(){
    this.guardarRoles = [];

    this.rest.getPermisosUsuarioRolRest(parseInt(this.idRol)).subscribe(res => {
      
      this.tableRoles = res;

      for(let perUser of this.tableRoles){
      
        this.rest.getOneRolPermisoRest(perUser.id_permiso).subscribe(data => {
          this.tablePermios = data;
          let dataPermisos = {
            id: this.tablePermios[0].id,
            funcion: this.tablePermios[0].funcion,
            link: this.tablePermios[0].link,
            etiqueta: this.tablePermios[0].etiqueta,
          }
          this.guardarRoles.push(dataPermisos);
        }, error => {
          console.log(error);
        });

      }

    }, error => {
      // console.log(error);
    });
  }

}
