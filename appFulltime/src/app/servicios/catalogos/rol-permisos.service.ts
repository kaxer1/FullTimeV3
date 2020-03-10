import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolPermisosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de ROL PERMISOS

  getRolPermisoRest(){
    console.log(this.http.get(`${this.API_URL}/`));
    return this.http.get(`${this.API_URL}/rolPermisos`);
    
  }

  getOneRolPermisoRest(id:number){
    return this.http.get(`${this.API_URL}/rolPermisos/${id}`);
  }
  
  postRolPermisoRest(data: any){
    console.log(data);
    return this.http.post(`${this.API_URL}/rolPermisos`, data);
  }

  // permisos denegado

  postPermisoDenegadoRest(data: any){
    console.log(data);
    return this.http.post(`${this.API_URL}/rolPermisos/denegado`, data);
  }
}
