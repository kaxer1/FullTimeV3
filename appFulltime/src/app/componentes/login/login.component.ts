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

  ngOnInit(): void {
    this.url = this.router.url;
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

      if (datos.message === 'error') {
        this.toastr.error('Usuario o contraseña no son correctos', 'Oops!')
      }
      else {
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', datos.usuario);
        localStorage.setItem('rol', datos.rol);
        localStorage.setItem('empleado', datos.empleado);
        this.toastr.success('Ingreso Existoso! ' + datos.usuario, 'Usuario y contraseña válidos')

        if (datos.rol === 1) { // Admin
          this.router.navigate(['/home'])
        }
        if (datos.rol === 2) { //Empleado
          this.router.navigate(['/datosEmpleado']);
        }
        
      }
    }, error => {
         console.log(error.message+"%%%% error de login")
    })
  }

}
