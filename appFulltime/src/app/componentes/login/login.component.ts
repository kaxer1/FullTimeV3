import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import * as moment from 'moment';
moment.locale('es');
import { LoginService } from '../../servicios/login/login.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

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
    public restU: UsuarioService,
    private router: Router,
    private toastr: ToastrService) {
    this.validarCredencialesF.setValue({
      usuarioF: '',
      passwordF: ''
    });
  }

  ngOnInit(): void {
    this.url = this.router.url;
    console.log(this.url);
    // console.log(window.history.back());
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
      pass: clave
    };

    // validacion del login
    this.rest.postCredenciales(dataUsuario).subscribe(datos => {
      console.log(datos)
      if (datos.message === 'error') {
        this.IngresoSistema(form.usuarioF, 'Fallido');
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
            this.router.navigate(['/ver-permiso/', id_permiso]);
            localStorage.removeItem("redireccionar");
          } else {
            this.router.navigate(['/home'])
          };
        }
        if (datos.rol === 2) { //Empleado
          this.router.navigate(['/estadisticas']);
        }
        this.IngresoSistema(form.usuarioF, 'Exitoso');
      }
    }, error => {
         console.log(error.message+"%%%% error de login")
    })
  }

  IngresoSistema(user, acceso: string) {
    var h = new Date();
    var f = moment();
    var fecha = f.format('YYYY-MM-DD');
    // Formato de hora actual
    if (h.getMinutes() < 10) {
      var time = h.getHours() + ':0' + h.getMinutes();
    }
    else {
      var time = h.getHours() + ':' + h.getMinutes();
    }

    let dataAcceso = {
      modulo: 'login',
      user_name: user,
      fecha: fecha,
      hora: time,
      acceso: acceso
    }
    this.restU.crearAccesosSistema(dataAcceso).subscribe(datos => { })
  }

}
