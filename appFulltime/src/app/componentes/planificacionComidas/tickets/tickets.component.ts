import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
moment.locale('es');
import { LoginService } from '../../../servicios/login/login.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})

export class TicketsComponent implements OnInit {

  title = 'login';

  url: string;

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
    public restEmpre: EmpresaService,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this.ObtenerLogo();
    console.log(this.url);
  }

  // Método para obtener el logo de la empresa
  logo: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logo = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  Imprimir() {
    console.log('N° de Ticket: 00456');
    console.log('Nombre: Jose Luis Altamirano Taco');
    console.log('Cédula: 1723658745');
    console.log('Tipo: Desayuno');
    console.log('Fecha: 2021-02-18');
    console.log('Observación: Plato completo');
  }

}
