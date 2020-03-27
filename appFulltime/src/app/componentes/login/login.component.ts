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
  hide = true;
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
    console.log(this.router.url);
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
    console.log("pass",clave);
    
    let dataUsuario = {
      nombre_usuario: form.usuarioF,
      pass: clave
    };
    this.rest.postCredenciales(dataUsuario).subscribe(datos => {
      this.IrPaginaPrincipal(datos);
    },
      error => {
      })
  }

  IrPaginaPrincipal(dato: any) {
    this.datosUsuarioIngresado = [];
    let valor = String(Object.values(dato));
    if (valor === 'error') {
      this.toastr.error('Usuario o contraseña no son correctos', 'Oops!')
    }
    else {
      this.datosUsuarioIngresado = dato;
      this.toastr.success('Ingreso Existoso! ' + this.datosUsuarioIngresado[0].usuario, 'Usuario y contraseña válidos')
      this.router.navigate(['/', 'home']);
      console.log(dato)
    }
  }

}
