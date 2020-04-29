import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  API_URL = 'http://localhost:3000';
  
  constructor( private http: HttpClient ) { }

  ObtenerListaVacaciones(){
    return this.http.get(`${this.API_URL}/vacaciones`);
  }

  RegistrarVacaciones(datos: any){
    return this.http.post(`${this.API_URL}/vacaciones`, datos);
  }

}
