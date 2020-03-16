import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../servicios/login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = 'login';
  hide = true;
  url: string;

  userMail = new FormControl('', Validators.required);
  pass = new FormControl('', Validators.required);

  public validarCredencialesF = new FormGroup({
    usuarioF: this.userMail,
    passwordF: this.pass 
  });

  constructor(
    public rest: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.validarCredencialesF.setValue({
      usuarioF: '',
      passwordF: ''
    });

  }

  ngOnInit(): void {
    this.url = this.router.url;
    console.log(this.router.url);
  }

  getCampoUsuarioError() {
    if (this.userMail.hasError('required')) {
      return 'Debe escribir el usuario';
    }
  }

  getCampoContraseniaError() {
    if (this.pass.hasError('required')) {
      return 'Debe escribir la contraseña';
    }
  }

  validarUsuario(form) {
    let dataUsuario = {
      nombre_usuario: form.usuarioF,
      pass: form.passwordF
    };
    this.rest.postCredenciales(dataUsuario).subscribe(response => {
      console.log(response);

      let dato = String(Object.values(response));
      console.log(dato);
      this.irHome(dato);
    },
      error => {
        console.log(error);
      })
  }

  irHome(dato: any) {
    if (dato === '0') {
      // console.log('Contraseña Incorrecta');
      this.toastr.error('contraseña incorrecta', 'Oops!')
      // alert('Contraseña incorrrecta')

    }
    else if (dato === '1') {
      // console.log('Usuario no registrado')
      this.toastr.error('Usuario no encontrado', 'Oops!')
      // alert('Usuario no registrado');

    }
    else {
      this.toastr.success('Ingreso Existoso!','Usuario y contraseña válidos')
      this.router.navigate(['/', 'home']);
      // window.location.href = 'http://localhost:4200/roles'
      // alert('Bienvenido ' + dataUsuario.nombre_usuario)
    }
  }

}
