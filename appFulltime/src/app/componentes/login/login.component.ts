import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../servicios/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  url: string;
  public validarCredencialesF = new FormGroup({
    usuarioF: new FormControl('', Validators.required),
    passwordF: new FormControl('', Validators.required)
  });

  constructor(
    public rest: LoginService,
    private router: Router
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

  irHome(dato: any){
    if (dato === '0') {
      console.log('Contraseña Incorrecta');
      alert('Contraseña incorrrecta')

    }
    else if (dato === '1') {
      console.log('Usuario no registrado')
      alert('Usuario no registrado');

    } else {
      console.log('Usuario y contraseña válidos');
      this.router.navigate(['/','home']);
      // window.location.href = 'http://localhost:4200/roles'
      // alert('Bienvenido ' + dataUsuario.nombre_usuario)
    }
  }

}
