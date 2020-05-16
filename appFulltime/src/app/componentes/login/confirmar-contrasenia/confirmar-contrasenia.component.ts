import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/servicios/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-confirmar-contrasenia',
  templateUrl: './confirmar-contrasenia.component.html',
  styleUrls: ['./confirmar-contrasenia.component.css']
})
export class ConfirmarContraseniaComponent implements OnInit {

  hide = true;
  token: string;
  NuevaContrasenia = new FormControl('', Validators.maxLength(12));
  ConfirmarContrasenia = new FormControl('', Validators.maxLength(12));

  public cambiarContraseniaForm = new FormGroup({
    nPass: this.NuevaContrasenia,
    cPass: this.ConfirmarContrasenia
  });

  constructor(
    private restLogin: LoginService,
    private toastr: ToastrService,
    public router: Router,
    public location: Location,
  ) { 
    var urlToken = this.location.prepareExternalUrl(this.location.path());
    this.token = urlToken.slice(1).split("/")[1];
  }

  ngOnInit(): void {
  }

  compararContrasenia(form){
    if (form.nPass != form.cPass){
      this.toastr.error('Incorrecto', 'las constrasenias no coinciden');
    }
  }

  EnviarContraseniaConfirmacion(form){

    //Cifrado de contraseña
    const md5 = new Md5();
    let clave = md5.appendStr(form.cPass).end();
    
    let data = {
      token: this.token,
      contrasena: clave
    }
    this.restLogin.changePassword(data).subscribe(res => {
      this.router.navigate(['/login']);
    });
  }

}
