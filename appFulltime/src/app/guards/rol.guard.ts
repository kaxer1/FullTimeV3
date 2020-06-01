import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { LoginService } from '../servicios/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  canActivate(): boolean{
    if (this.loginService.getRol()) {
      return true;
    }

    this.router.navigate(['/datosEmpleado']);
    return false;
  }
  
}
