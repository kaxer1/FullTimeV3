import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { RolesService } from 'src/app/servicios/roles/roles.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  public nuevoEmpleadoForm = new FormGroup({
    nombreForm: new FormControl('', Validators.required),
    apellidoForm: new FormControl('', Validators.required),
    cedulaForm: new FormControl('', Validators.required),
    emailForm: new FormControl('', Validators.required),
    telefonoForm: new FormControl('', Validators.required),
    domicilioForm: new FormControl('', Validators.required),
    fechaForm: new FormControl('', Validators.required),
    estadoCivilForm: new FormControl('', Validators.required),
    generoForm: new FormControl('', Validators.required),
    estadoForm: new FormControl('', Validators.required),
    correoAlternativoForm: new FormControl('', Validators.required),
  });
  constructor(
    public rest: RolesService
  ) { }

  ngOnInit(): void {
    this.limpliarCampos();
  }

  limpliarCampos(){
    this.nuevoEmpleadoForm.setValue({
      nombreForm: '',
      apellidoForm: '',
      cedulaForm: '',
      emailForm: '',
      telefonoForm: '',
      domicilioForm: '',
      fechaForm: '',
      estadoCivilForm: '',
      generoForm: '',
      estadoForm: '',
      correoAlternativoForm: '',
    });
  }

  insertarEmpleado(form){
    let dataEmpleado = {
      cedula: form.cedulaForm,
      apellido: form.apellidoForm,
      nombre: form.nombreForm,
      estado_civil: form.estadoCivilForm,
      genero: form.generoForm,
      correo: form.emailForm,
      fecha_nacimiento: form.fechaForm,
      estado: form.estadoForm,
      correo_alernativo: form.correoAlternativoForm,
      domicilio: form.domicilioForm,
      telefono: form.telefonoForm,
    };

    this.rest.postEmpleadoRest(dataEmpleado)
    .subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      });

    this.limpliarCampos();

  }

}
