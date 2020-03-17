import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
<<<<<<< HEAD

=======
>>>>>>> e85836e1f7814d954cfae333d1a7edd09617f8f0

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appFulltime';

  constructor(
    public router: Router,
    public location: Location
<<<<<<< HEAD
  ) { }

  removerMenu() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (titlee === 'login') {
      return false;
    }
    else {
      return true;
    }
  }

  removerLogin() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (titlee != 'login') {
      return false;
    }
    else {
      return true;
    }
  }
=======
  ){ }

  removerMenu(){
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    tituloPestania = tituloPestania.slice(1);
    if (tituloPestania === 'login'){
      return false;
    } else {
      return true;
    }
  }

  removerLogin(){
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    tituloPestania = tituloPestania.slice(1);
    if (tituloPestania != 'login'){
      return false;
    } else {
      return true;
    }
  }
 

>>>>>>> e85836e1f7814d954cfae333d1a7edd09617f8f0
}


