import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Rol} from '../../modelos/roles/roles'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  API_URI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Roles

  getRoles(){
    return this.http.get(`${this.API_URI}/api`);
  }

  getRol(id: number){
    return this.http.get(`${this.API_URI}/api/${id}`);
  }

  eliminarRol(id: number){
    return this.http.get(`${this.API_URI}/api/${id}`);
  }
  
  guardarRol(rol: Rol){
    return this.http.post(`${this.API_URI}/api`, rol);
  }
  
  actualizarRol(id: number, actualizaRol: Rol): Observable<Rol>{
    return this.http.put(`${this.API_URI}/api/${id}`, actualizaRol);
  }
  
  // Empleados
  
  getEmpleadosRest(){
    return this.http.get(`${this.API_URI}/empleado`);
  }
  
  getOneEmpleadoRest(id: number){
    return this.http.get(`${this.API_URI}/empleado/${id}`);
  }

  postEmpleadoRest(data: any){
    console.log(data);
    return this.http.post(`${this.API_URI}/empleado`, data);
  }
  
}
