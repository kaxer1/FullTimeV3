import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';

import { LoginService } from '../../servicios/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  title = 'login';
  hide1 = true;
  url: string;

  // Almacenamiento datos usuario ingresado
  datosUsuarioIngresado: any = [];

  // Validaciones de campos de formulario
  userMail = new FormControl('', Validators.required);
  pass = new FormControl('', Validators.required);

  public validarCredencialesF = new FormGroup({
    usuarioF: this.userMail,
    passwordF: this.pass
  });

  constructor(
    public rest: LoginService,
    private router: Router,
    private toastr: ToastrService) {
    this.validarCredencialesF.setValue({
      usuarioF: '',
      passwordF: ''
    });
  }

  latitud: number;
  longitud: number;

  private options = {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 15000
  };

  ngOnInit(): void {
    this.url = this.router.url;
    console.log(this.url); 
    this.Geolocalizar();
    // console.log(window.history.back());
  }

  Geolocalizar() {
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(
        (objPosition) => {
          // console.log(objPosition);
          
          this.latitud = objPosition.coords.latitude;
          this.longitud = objPosition.coords.longitude;

          console.log(this.longitud, this.latitud);
          
        }, (objPositionError) => {
          switch (objPositionError.code)
          {
            case objPositionError.PERMISSION_DENIED:
              console.log('No se ha permitido el acceso a la posición del usuario.');
            break;
            case objPositionError.POSITION_UNAVAILABLE:
              console.log('No se ha podido acceder a la información de su posición.');
            break;
            case objPositionError.TIMEOUT:
              console.log('El servicio ha tardado demasiado tiempo en responder.');
            break;
            default:
              console.log('Error desconocido.');
          }
        }, this.options);
    }
    else
    {
      console.log('Su navegador no soporta la API de geolocalización.');
    }
  }

  ObtenerMensajeCampoUsuarioError() {
    if (this.userMail.hasError('required')) {
      return 'Ingresar nombre de usuario';
    }
  }

  ObtenerMensajeCampoContraseniaError() {
    if (this.pass.hasError('required')) {
      return 'Ingresar su contraseña';
    }
  }

  ValidarUsuario(form) {
    //Cifrado de contraseña
    const md5 = new Md5();
    let clave = md5.appendStr(form.passwordF).end();
    
    let dataUsuario = {
      nombre_usuario: form.usuarioF,
      pass: clave,
      latitud: this.latitud,
      longitud: this.longitud
    };
    console.log(dataUsuario);

    if (this.latitud === undefined) {
      this.Geolocalizar();
      return this.toastr.error('Primero permitir conocer la ubicación del dispositivo')
    }

    // validacion del login
    this.rest.postCredenciales(dataUsuario).subscribe(datos => {
      console.log(datos)
      if (datos.message === 'error') {
        this.toastr.error('Usuario o contraseña no son correctos', 'Oops!', {
          timeOut: 6000,
        })
      }
      else {
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', datos.usuario);
        localStorage.setItem('rol', datos.rol);
        localStorage.setItem('empleado', datos.empleado);
        localStorage.setItem('empresa', datos.empresa);
        localStorage.setItem('sucursal', datos.sucursal);
        localStorage.setItem('departamento', datos.departamento);
        localStorage.setItem('ultimoCargo', datos.cargo);
        localStorage.setItem('autoriza', datos.estado);
        this.toastr.success('Ingreso Existoso! ' + datos.usuario, 'Usuario y contraseña válidos', {
          timeOut: 6000,
        })

        if (datos.rol === 1) { // Admin
          if (!!localStorage.getItem("redireccionar")) {
            let id_permiso = parseInt(localStorage.getItem("redireccionar"));
            this.router.navigate(['/ver-permiso/',id_permiso]);
            localStorage.removeItem("redireccionar");
          } else {
            this.router.navigate(['/home'])
          };
        }
        if (datos.rol === 2) { //Empleado
          this.router.navigate(['/estadisticas']);
        }
        
      }
    }, error => {

    })
  }

}
