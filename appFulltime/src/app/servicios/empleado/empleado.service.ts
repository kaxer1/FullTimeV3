import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  API_URI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
  
  // Empleados
  
  getEmpleadosRest(){
    return this.http.get(`${this.API_URI}/empleado`);
  }
  
  getOneEmpleadoRest(id: number){
    return this.http.get(`${this.API_URI}/empleado/${id}`);
  }

  postEmpleadoRest(data: any){
    return this.http.post(`${this.API_URI}/empleado`, data);
  }

  // para insertar el empleado con sus respectivos titulos
  postEmpleadoTitulos(data: any){
    return this.http.post(`${this.API_URI}/empleado/emplTitulos`, data);
  }

  getEmpleadoTituloRest(id: number){
    return this.http.get(`${this.API_URI}/empleado/emplTitulos/${id}`);
  }
}
