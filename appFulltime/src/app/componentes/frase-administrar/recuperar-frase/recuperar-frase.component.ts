import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-recuperar-frase',
  templateUrl: './recuperar-frase.component.html',
  styleUrls: ['./recuperar-frase.component.css']
})
export class RecuperarFraseComponent implements OnInit {

  token: string;

  mensaje: any = [];

  // CAMPOS DEL FORMULARIO
  NuevaFrase = new FormControl('', Validators.maxLength(100));

  // CAMPOS DEL FORMULARIO EN UN GRUPO
  public fraseForm = new FormGroup({
    nFrase: this.NuevaFrase,
  });

  constructor(
    private rest: UsuarioService,
    private toastr: ToastrService,
    public router: Router,
    public location: Location,
  ) {
    var urlToken = this.location.prepareExternalUrl(this.location.path());
    this.token = urlToken.slice(1).split("/")[1];
  }

  ngOnInit(): void {
  }

  IngresarFrase(form) {
    let data = {
      token: this.token,
      frase: form.nFrase
    }
    this.rest.CambiarFrase(data).subscribe(res => {
      this.mensaje = res;
      if (this.mensaje.expiro === 'si') {
        this.router.navigate(['/frase-olvidar']);
        this.toastr.error(this.mensaje.message, 'UPS! Algo a salido mal.', {
          timeOut: 6000,
        });
      } else {
        this.router.navigate(['/login']);
        this.toastr.success('Operación exitosa', this.mensaje.message, {
          timeOut: 6000,
        });
      }
    });
  }

}
