import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { ToastrService} from 'ngx-toastr'
import { RolesService } from 'src/app/servicios/roles/roles.service';
import { UsuarioService } from 'src/app/servicios/catalogos/usuario.service';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  empleadoGuardado: any = [];
  roles: any = [];
  hide = true;

  isLinear = true;
  primeroFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  terceroFormGroup: FormGroup;

  constructor(
    private rest: EmpleadoService,
    private toastr: ToastrService,
    private rol: RolesService,
    private user: UsuarioService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
    this.primeroFormGroup = this._formBuilder.group({
      nombreForm: ['', Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")],
      apellidoForm: ['', Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}")],
      cedulaForm: ['', Validators.required],
      emailForm: ['', Validators.email],
      correoAlternativoForm: ['', Validators.email],
      fechaForm: ['', Validators.required],
    });
    this.segundoFormGroup = this._formBuilder.group({
      telefonoForm: ['', Validators.required],
      domicilioForm: ['', Validators.required],
      estadoCivilForm: ['', Validators.required],
      generoForm: ['', Validators.required],
      estadoForm: ['', Validators.required],
      // nacionalidadForm: ['', Validators.required]
    });
    this.terceroFormGroup = this._formBuilder.group({
      rolForm: ['', Validators.required],
      userForm: ['', Validators.required],
      passForm: ['', Validators.required],
    });
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  limpliarCampos() {
    this.primeroFormGroup.reset();
    this.segundoFormGroup.reset();
    this.terceroFormGroup.reset();
  }

  cargarRoles(){
    this.rol.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  insertarEmpleado(form1, form2, form3) {
    let dataEmpleado = {
      cedula: form1.cedulaForm,
      apellido: form1.apellidoForm,
      nombre: form1.nombreForm,
      esta_civil: form2.estadoCivilForm,
      genero: form2.generoForm,
      correo: form1.emailForm,
      fec_nacimiento: form1.fechaForm,
      estado: form2.estadoForm,
      mail_alernativo: form1.correoAlternativoForm,
      domicilio: form2.domicilioForm,
      telefono: form2.telefonoForm,
      // nacionalidad: form2.nacionalidadForm
    };

    this.rest.postEmpleadoRest(dataEmpleado).subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Empleado guardado');
        this.empleadoGuardado = response;

        //Cifrado de contraseña
        const md5 = new Md5();
        let clave = md5.appendStr(form3.passForm).end();
        console.log("pass",clave);

        let dataUser = {
          usuario: form3.userForm,
          contrasena: clave,
          estado: true,
          id_rol: form3.rolForm,
          id_empleado: this.empleadoGuardado.id,
          app_habilita: true
        }

        this.user.postUsuarioRest(dataUser).subscribe(data => {
          this.agregarDiscapacidad(this.empleadoGuardado.id);
        });
      },
      error => {
        console.log(error);
      });

    this.limpliarCampos();
  }

  agregarDiscapacidad(id: string){
    this.router.navigate(['/verEmpleado/',id]);
  }

}


