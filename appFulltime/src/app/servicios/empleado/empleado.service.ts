import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
    console.log(data);
    return this.http.post(`${this.API_URI}/empleado`, data);
  }
}
