import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URI = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
    public router: Router) { }

  postCredenciales(data: any) {
    return this.http.post<any>(`${this.API_URI}/login`, data);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }
  
  getToken() {
    return localStorage.getItem('token');
  }

  getRol() {
    return parseInt(localStorage.getItem('rol'));//Empleado
  }

  loggedRol() {
    return !!localStorage.getItem('rol');
  }

  getRolMenu() {
    let rol = parseInt(localStorage.getItem('rol'));
    if(rol === 1){ 
      return true;//Admin
    }
    return false;//Empleado
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['/']);
  }

  forgetPassword(data: any){
    return this.http.post(`${this.API_URI}/login/recuperar-contrasenia/`, data)
  }

  changePassword(data: any){
    return this.http.post(`${this.API_URI}/login/cambiar-contrasenia`, data)
  }
}
