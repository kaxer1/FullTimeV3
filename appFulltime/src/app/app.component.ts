import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
 

}


