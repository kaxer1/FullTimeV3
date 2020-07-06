import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolPermisosService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de ROL PERMISOS

  getRolPermisoRest() {
    return this.http.get(`${this.API_URL}/rolPermisos`);
  }

  getOneRolPermisoRest(id: number) {
    return this.http.get(`${this.API_URL}/rolPermisos/${id}`);
  }

  postRolPermisoRest(data: any) {
    return this.http.post(`${this.API_URL}/rolPermisos`, data);
  }

  // permisos denegado

  getPermisosUsuarioRolRest(id: number) {
    return this.http.get(`${this.API_URL}/rolPermisos/denegado/${id}`);
  }

  postPermisoDenegadoRest(data: any) {
    return this.http.post(`${this.API_URL}/rolPermisos/denegado`, data);
  }

}
