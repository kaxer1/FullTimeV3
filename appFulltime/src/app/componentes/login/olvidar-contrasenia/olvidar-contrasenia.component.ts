import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/servicios/login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-olvidar-contrasenia',
  templateUrl: './olvidar-contrasenia.component.html',
  styleUrls: ['./olvidar-contrasenia.component.css']
})

export class OlvidarContraseniaComponent implements OnInit {

  correo = new FormControl('', [Validators.required, Validators.email]);

  public olvidarContraseniaF = new FormGroup({
    usuarioF: this.correo,
  });

  constructor(
    public rest: LoginService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {}

  ObtenerMensajeCampoUsuarioError() {
    if (this.correo.hasError('required')) {
      return 'Ingresar correo de usuario';
    }
    if (this.correo.hasError('email')) {
      return 'No es un correo electrónico';
    }
  }
  respuesta: any = [];

  EnviarCorreoConfirmacion(form) {
    let dataPass = {
      correo: form.usuarioF
    }
    this.rest.forgetPassword(dataPass).subscribe(res => {
      this.respuesta = res;
      if (this.respuesta.mail === 'si') {
        this.toastr.success('Operción Exitosa', 'Solicitud enviada Revisar su correo electrónico', {
          timeOut: 6000,
        });
        this.router.navigate(['/login']);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Operción Incorrecta', 'El correo no consta en los registros', {
        timeOut: 6000,
      });
      this.correo.reset();
    })
  }

  Cancelar() {
    this.router.navigate(['/login']);
  }

}
