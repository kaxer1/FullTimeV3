import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URI = 'http://localhost:3000';

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

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('empleado');
    this.router.navigate(['/']);
  }
}
