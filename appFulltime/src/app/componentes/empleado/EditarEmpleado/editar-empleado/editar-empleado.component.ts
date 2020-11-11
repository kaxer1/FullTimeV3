import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

import { VerEmpleadoComponent } from '../../ver-empleado/ver-empleado.component';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';

@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class EditarEmpleadoComponent implements OnInit {

  nacionalidades: any = [];
  private idNacionalidad: number;
  private nacionalidadNombre: string;

  roles: any = [];
  usuario: any = [];
  hide = true;

  isLinear = true;
  primeroFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  terceroFormGroup: FormGroup;

  NacionalidadControl = new FormControl('', Validators.required);
  filteredOptions: Observable<string[]>;
  idEmpleado: string;

  constructor(
    private rest: EmpleadoService,
    private user: UsuarioService,
    private rol: RolesService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private verEmpleado: VerEmpleadoComponent,
    public router: Router,
  ) {
    var cadena = this.router.url.split('#')[0];
    this.idEmpleado = cadena.split("/")[2];
  }

  ngOnInit(): void {
    this.cargarRoles();
    this.obtenerNacionalidades();
    this.obtenerEmpleado();
    this.VerificarCodigo();
    this.primeroFormGroup = this._formBuilder.group({
      codigoForm: [''],
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
      passForm: [''],
    });
    this.filteredOptions = this.NacionalidadControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  datosCodigo: any = [];
  escritura = false;
  VerificarCodigo() {
    this.datosCodigo = [];
    this.rest.ObtenerCodigo().subscribe(datos => {
      this.datosCodigo = datos;
      if (this.datosCodigo[0].automatico === true) {
        this.escritura = true;
      }
      else {
        this.escritura = false;
      }
    }, error => {
      this.toastr.info('Primero configurar el código de empleado.');
      this.router.navigate(['/codigo/']);
    });
  }

  private _filter(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.nacionalidades.filter(nacionalidades => nacionalidades.nombre.toLowerCase().includes(filterValue));
    }
  }

  cargarRoles() {
    this.rol.getRoles().subscribe(data => {
      this.roles = data;
    });
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

  actualizarEmpleado(form1, form2, form3) {
    // Busca el id de la nacionalidad elegida en el autocompletado
    this.nacionalidades.forEach(obj => {
      if (form2.nacionalidadForm == obj.nombre) {
        console.log(obj);
        this.idNacionalidad = obj.id;
      }
    });
    // Realizar un capital letter a los nombres y apellidos
    var NombreCapitalizado: any;
    let nombres = form1.nombreForm.split(' ');
    if (nombres.length > 1) {
      console.log('tamaño de la cadena', nombres.length);
      let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
      let name2 = nombres[1].charAt(0).toUpperCase() + nombres[1].slice(1);
      NombreCapitalizado = name1 + ' ' + name2;
    }
    else {
      let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
      var NombreCapitalizado = name1
    }

    var ApellidoCapitalizado: any;
    let apellidos = form1.apellidoForm.split(' ');
    if (apellidos.length > 1) {
      let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
      let lastname2 = apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1);
      ApellidoCapitalizado = lastname1 + ' ' + lastname2;
    }
    else {
      let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
      ApellidoCapitalizado = lastname1
    }
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
      id_nacionalidad: this.idNacionalidad,
      codigo: form1.codigoForm
    };

    if (this.contador === 0) {
      this.rest.putEmpleadoRest(dataEmpleado, parseInt(this.idEmpleado)).subscribe(response => {
        if (response.message === 'error') {
          this.toastr.error('El código y cédula del empleado son datos únicos y no deben ser igual al resto de registros.', 'Uno de los datos ingresados es Incorrecto');
        }
        else {
          this.VerificarContrasena(form3, form1);
        }
      });
    }
    else {
      this.VerificarContrasena(form3, form1);
    }
  }

  VerificarContrasena(form3, form1) {
    if (form3.passForm === '') {
      let clave = this.usuario[0].contrasena;
      this.ActualizarUser(form3, clave, form1);
    }
    else {
      const md5 = new Md5();
      let clave = md5.appendStr(form3.passForm).end();
      this.ActualizarUser(form3, clave, form1);
    }
  }

  contador: number = 0;
  ActualizarUser(form3, clave, form1) {
    let dataUser = {
      usuario: form3.userForm,
      contrasena: clave,
      id_rol: form3.rolForm,
      id_empleado: parseInt(this.idEmpleado),
    }
    this.user.ActualizarDatos(dataUser).subscribe(data => {
      if (data.message === 'error') {
        this.toastr.error('Por favor ingrese otro nombre de usuario', 'Nombre de usuario existente');
        this.contador = 1;
      }
      else {
        this.toastr.success('Operacion Exitosa', 'Empleado Actualizado');
        this.ActualizarCodigo(form1.codigoForm);
        this.limpliarCampos();
        this.guardar();
        this.cancelar();
        this.contador = 0;
      }
    });
  }

  ActualizarCodigo(codigo) {
    if (this.datosCodigo[0].automatico === true) {
      let dataCodigo = {
        valor: codigo,
        id: 1
      }
      this.rest.ActualizarCodigo(dataCodigo).subscribe(res => {
      })
    }
  }

  limpliarCampos() {
    this.primeroFormGroup.reset();
    this.segundoFormGroup.reset();
    this.terceroFormGroup.reset();
  }

  obtenerNacionalidades() {
    this.rest.getListaNacionalidades().subscribe(res => {
      this.nacionalidades = res;
    });
  }

  obtenerEmpleado() {
    this.rest.getOneEmpleadoRest(parseInt(this.idEmpleado)).subscribe(res => {
      // busca el nombre de la nacionalidad de acuerdo al id de la nacionalidad
      this.nacionalidades.forEach(obj => {
        if (res[0].id_nacionalidad == obj.id) {
          console.log(obj);
          this.nacionalidadNombre = obj.nombre;
        }
      });

      this.primeroFormGroup.setValue({
        codigoForm: res[0].codigo,
        nombreForm: res[0].nombre,
        apellidoForm: res[0].apellido,
        cedulaForm: res[0].cedula,
        emailForm: res[0].correo,
        correoAlternativoForm: res[0].mail_alternativo,
        fechaForm: res[0].fec_nacimiento,
      });
      this.segundoFormGroup.setValue({
        telefonoForm: res[0].telefono,
        domicilioForm: res[0].domicilio,
        estadoCivilForm: res[0].esta_civil,
        generoForm: res[0].genero,
        estadoForm: res[0].estado,
        nacionalidadForm: this.nacionalidadNombre,
      });
    });
    this.user.BuscarDatosUser(parseInt(this.idEmpleado)).subscribe(res => {
      this.usuario = [];
      this.usuario = res;
      this.terceroFormGroup.patchValue({
        rolForm: this.usuario[0].id_rol,
        userForm: this.usuario[0].usuario,
      });
    });
  }

  guardar() { this.verEmpleado.verEmpleado(this.idEmpleado); }

  cancelar() { this.verEmpleado.verRegistroEdicion(true); }

}
