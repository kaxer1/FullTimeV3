import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { ToastrService} from 'ngx-toastr'
import { RolesService } from 'src/app/servicios/roles/roles.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

    nombre = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
    apellido = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}")]);
    cedula = new FormControl('', [Validators.required, Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'), Validators.maxLength(10)]);
    email = new FormControl('', [Validators.required, Validators.email]);
    telefono = new FormControl('', Validators.required);
    domicilio = new FormControl('', Validators.required);
    fecha = new FormControl('', Validators.required);
    estadoCivil = new FormControl('', Validators.required);
    genero = new FormControl('', Validators.required);
    estado = new FormControl('', Validators.required);
    correoAlternativo = new FormControl('', [Validators.required, Validators.email]);
    nacionalidad = new FormControl('', Validators.required);

  public nuevoEmpleadoForm = new FormGroup({
    nombreForm: this.nombre,
    apellidoForm: this.apellido,
    cedulaForm: this.cedula,
    emailForm: this.email,
    telefonoForm: this.telefono,
    domicilioForm: this.domicilio,
    fechaForm: this.fecha,
    estadoCivilForm: this.estadoCivil,
    generoForm: this.genero,
    estadoForm: this.estado,
    correoAlternativoForm: this.correoAlternativo,
    nacionalidadForm: this.nacionalidad
  });

  empleadoGuardado: any = [];
  roles: any = [];

  constructor(
    private rest: EmpleadoService,
    private toastr: ToastrService,
    private rol: RolesService
  ) { }

  ngOnInit(): void {
    this.limpliarCampos();
    this.cargarRoles();
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  limpliarCampos() {
    this.nuevoEmpleadoForm.reset();
  }

  cargarRoles(){
    this.rol.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  insertarEmpleado(form) {
    let dataEmpleado = {
      cedula: form.cedulaForm,
      apellido: form.apellidoForm,
      nombre: form.nombreForm,
      esta_civil: form.estadoCivilForm,
      genero: form.generoForm,
      correo: form.emailForm,
      fec_nacimiento: form.fechaForm,
      estado: form.estadoForm,
      mail_alernativo: form.correoAlternativoForm,
      domicilio: form.domicilioForm,
      telefono: form.telefonoForm,
      nacionalidad: form.nacionalidadForm
    };

    this.rest.postEmpleadoRest(dataEmpleado)
    .subscribe(
      response => {
        this.toastr.success('Operacion Exitosa', 'Empleado guardado');
        // console.log(response);
        this.empleadoGuardado = response;
        let idEmpleadoGuardado = this.empleadoGuardado.text[0].id;
        console.log();
      },
      error => {
        console.log(error);
      });

    this.limpliarCampos();

  }

}


