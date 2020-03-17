import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appFulltime';

  @Input() recibeUrl: string;

  constructor(
    public router: Router,
    public location: Location
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
}
