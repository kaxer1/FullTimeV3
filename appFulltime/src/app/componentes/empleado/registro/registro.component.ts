import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { ToastrService } from 'ngx-toastr'
import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class RegistroComponent implements OnInit {

  empleadoGuardado: any = [];
  nacionalidades: any = [];
  roles: any = [];
  hide = true;

  private idNacionalidad: number;

  isLinear = false;
  primeroFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  terceroFormGroup: FormGroup;

  NacionalidadControl = new FormControl('', Validators.required);
  filteredOptions: Observable<string[]>;

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
    this.obtenerNacionalidades();
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
      nacionalidadForm: this.NacionalidadControl
    });
    this.terceroFormGroup = this._formBuilder.group({
      rolForm: ['', Validators.required],
      userForm: ['', Validators.required],
      passForm: ['', Validators.required],
    });
    this.filteredOptions = this.NacionalidadControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.nacionalidades.filter(nacionalidades => nacionalidades.nombre.toLowerCase().includes(filterValue));
    }
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  limpliarCampos() {
    this.primeroFormGroup.reset();
    this.segundoFormGroup.reset();
    this.terceroFormGroup.reset();
  }

  cargarRoles() {
    this.rol.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  insertarEmpleado(form1, form2, form3) {

    // busca el id de la nacionalidad elegida en el autocompletado
    this.nacionalidades.forEach(obj => {
      if (form2.nacionalidadForm == obj.nombre) {
        console.log(obj);
        this.idNacionalidad = obj.id;
      }
    });

    // realiza un capital letter a los nombres y apellidos
    let nombres = form1.nombreForm.split(' ');
    let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
    let name2 = nombres[1].charAt(0).toUpperCase() + nombres[1].slice(1);
    const NombreCapitalizado = name1 + ' ' + name2;

    let apellidos = form1.apellidoForm.split(' ');
    let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
    let lastname2 = apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1);
    const ApellidoCapitalizado = lastname1 + ' ' + lastname2;

    let dataEmpleado = {
      cedula: form1.cedulaForm,
      apellido: ApellidoCapitalizado,
      nombre: NombreCapitalizado,
      esta_civil: form2.estadoCivilForm,
      genero: form2.generoForm,
      correo: form1.emailForm,
      fec_nacimiento: form1.fechaForm,
      estado: form2.estadoForm,
      mail_alernativo: form1.correoAlternativoForm,
      domicilio: form2.domicilioForm,
      telefono: form2.telefonoForm,
      id_nacionalidad: this.idNacionalidad
    };

    console.log(dataEmpleado);
    this.rest.postEmpleadoRest(dataEmpleado).subscribe(response => {
      this.toastr.success('Operacion Exitosa', 'Empleado guardado');
      this.empleadoGuardado = response;

      //Cifrado de contraseña
      const md5 = new Md5();
      let clave = md5.appendStr(form3.passForm).end();
      console.log("pass", clave);

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

  agregarDiscapacidad(id: string) {
    this.router.navigate(['/verEmpleado/', id]);
  }

  obtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
  }

}


