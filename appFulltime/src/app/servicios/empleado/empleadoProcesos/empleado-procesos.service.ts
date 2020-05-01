import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoProcesosService {

  API_URL = 'http://localhost:3000';
  
  constructor( private http: HttpClient ) { }

  ObtenerListaEmpleProcesos(){
    return this.http.get(`${this.API_URL}/empleadoProcesos`);
  }

  RegistrarEmpleProcesos(datos: any){
    return this.http.post(`${this.API_URL}/empleadoProcesos`, datos);
  }
  
}
