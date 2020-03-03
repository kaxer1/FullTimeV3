import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  public nuevoEmpleadoForm = new FormGroup({
    nombreForm: new FormControl('', [Validators.required,Validators.pattern('[a-zA-z]+')]),
    apellidoForm: new FormControl('', [Validators.required, Validators.pattern('[a-zA-z]+')]),
    cedulaForm: new FormControl('', [Validators.required, Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]') ]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    telefonoForm: new FormControl('', Validators.required),
    domicilioForm: new FormControl('', Validators.required),
    fechaForm: new FormControl('', Validators.required),
    estadoCivilForm: new FormControl('', Validators.required),
    generoForm: new FormControl('', Validators.required),
    estadoForm: new FormControl('', Validators.required),
    correoAlternativoForm: new FormControl('', [Validators.email,Validators.required]),
  });
  constructor(
    private rest: EmpleadoService,
    private toastr: ToastrService
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
        this.toastr.success('Operacion Exitosa', 'Empleado guardado');
        console.log(response);
      },
      error => {
        console.log(error);
      });

    this.limpliarCampos();

  }

}
