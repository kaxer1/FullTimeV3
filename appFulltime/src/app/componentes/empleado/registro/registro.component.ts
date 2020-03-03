import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  public nuevoEmpleadoForm = new FormGroup({

    nombreForm: new FormControl('', [Validators.required, Validators.pattern('[a-zA-z]+')]),
    apellidoForm: new FormControl('', [Validators.required, Validators.pattern('[a-zA-z]+')]),
    cedulaForm: new FormControl('', [Validators.required, Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'), Validators.maxLength(10)]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    telefonoForm: new FormControl('', Validators.required),
    domicilioForm: new FormControl('', Validators.required),
    fechaForm: new FormControl('', Validators.required),
    estadoCivilForm: new FormControl('', Validators.required),
    generoForm: new FormControl('', Validators.required),
    estadoForm: new FormControl('', Validators.required),
    correoAlternativoForm: new FormControl('', [Validators.email, Validators.required]),
  });
  constructor(
    public rest: EmpleadoService
  ) { }

  ngOnInit(): void {
    this.limpliarCampos();
  }

  soloNumeros(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let numeros = "0123456789";
    let especiales = [8, 37, 39, 46];

    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }

    if (numeros.indexOf(tecla) == -1 && !tecla_especial)
      return false;
  }

  limpliarCampos() {

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
