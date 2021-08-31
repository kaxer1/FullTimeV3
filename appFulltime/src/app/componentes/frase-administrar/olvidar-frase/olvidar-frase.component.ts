import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/servicios/login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-olvidar-frase',
  templateUrl: './olvidar-frase.component.html',
  styleUrls: ['./olvidar-frase.component.css']
})
export class OlvidarFraseComponent implements OnInit {

  correo = new FormControl('', [Validators.required, Validators.email]);

  public olvidarFrase = new FormGroup({
    usuarioF: this.correo,
  });

  constructor(
    public rest: UsuarioService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void { }

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
    this.rest.RecuperarFraseSeguridad(dataPass).subscribe(res => {
      this.respuesta = res;
      if (this.respuesta.mail === 'si') {
        this.toastr.success('Solicitud Enviada.', 'Por favor revisar su correo electrónico', {
          timeOut: 6000,
        });
        this.router.navigate(['/login']);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Operación Incorrecta', 'El correo no consta en los registros.', {
        timeOut: 6000,
      });
      this.correo.reset();
    })
  }

  Cancelar() {
    this.router.navigate(['/login']);
  }

}
