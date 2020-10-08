import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../servicios/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if (this.loginService.loggedIn()) {
      
      if (this.loginService.getRol() >= route.data.rolMix && this.loginService.getEstado() === true) {
        return true;
      }
      
      if (this.loginService.getRol() >= route.data.rolMix) { //visualizar avisos de timbres para todos los usuarios
        return true;
      }

      if (this.loginService.getRol() === route.data.roles) {
        return true;
      }

      if (this.loginService.getRol() != route.data.roles) {

        if (this.loginService.getRol() === 1) {
          this.router.navigate(['/home']);
          return true;
        }
        if (this.loginService.getRol() === 2) {
          this.router.navigate(['/datosEmpleado']);
          return true;
        }
      }
    }

    if(!this.loginService.loggedIn()){
      // console.log(this.loginService.loggedRol());
      if (this.loginService.loggedRol() === route.data.log){
        return true;
      }
    }
    let id_permiso_solicitado_sin_loggeo = state.url.split("/")[2]; 
    localStorage.setItem("redireccionar",  id_permiso_solicitado_sin_loggeo)
    this.router.navigate(['/login']);
    return false;
  }
  
}
