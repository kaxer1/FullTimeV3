import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Md5 } from 'ts-md5';

import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.css']
})

export class SeguridadComponent implements OnInit {

  hide1 = true;
  hide2 = true;
  hide3 = true;
  usuario: string;
  ActualContrasena = new FormControl('', Validators.maxLength(12));
  datosUser: any = [];

  public seguridadForm = new FormGroup({
    aPass: this.ActualContrasena
  });

  constructor(
    private restUser: UsuarioService,
    private toastr: ToastrService,
    public router: Router,
    public location: Location,
    public dialogRef: MatDialogRef<SeguridadComponent>,
  ) {
    this.usuario = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
  }

  CompararContrasenia(form) {
    /* Cifrado de contraseña */
    const md5 = new Md5();
    let pass = md5.appendStr(form.aPass).end();
    this.datosUser = [];
    this.restUser.BuscarDatosUser(parseInt(this.usuario)).subscribe(data => {
      this.datosUser = data;
      console.log(pass);
      if (pass === this.datosUser[0].contrasena) {
        this.dialogRef.close(true);
      }
      else {
        this.toastr.error('Incorrecto', 'La contraseña actual no es la correcta', {
          timeOut: 6000,
        });
      }
    });
  }

  CerrarRegistro() {
    this.dialogRef.close(false);
  }
}
