import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoginService } from './servicios/login/login.service';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AppFulltime';

  log: boolean;

  constructor(
    public router: Router,
    public location: Location,
    public loginServices: LoginService,
    private socket: Socket
  ){ 
    this.socket.on('enviar_notification', (data) => {
      console.log(data);
    })
  }

  removerForget(){
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    tituloPestania = tituloPestania.slice(1);
    if (tituloPestania === 'olvidar-contrasenia'){
      return false;
    } else {
      return true;
    };
  }

  removerLogin(){
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    tituloPestania = tituloPestania.slice(1);
    if (tituloPestania === 'login'){
      return false;
    } else {
      return true;
    }
  }

  removerConfirmet(){
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    // console.log(tituloPestania.slice(1).split("/")[0]);
    tituloPestania = tituloPestania.slice(1).split("/")[0];
    if (tituloPestania === 'confirmar-contrasenia'){
      return false;
    } else {
      return true;
    }
  }

  removerMain(){
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    // console.log(tituloPestania.slice(1).split("/")[0]);
    tituloPestania = tituloPestania.slice(1).split("/")[0];
    if (tituloPestania === 'confirmar-contrasenia' || tituloPestania === 'login' || tituloPestania === 'olvidar-contrasenia'){
      return true;
    } else {
      return false;
    }
  }

}


