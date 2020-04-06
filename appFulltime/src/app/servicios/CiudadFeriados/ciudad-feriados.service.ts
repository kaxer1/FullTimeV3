import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CiudadFeriadosService {

  
  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Asignar Ciudad Feriado

  CrearCiudadFeriado(datos: any){ 
    return this.http.post(`${this.API_URL}/ciudadFeriados/insertar`, datos);
  }

  BuscarIdCiudad(datos: any){ 
    return this.http.post(`${this.API_URL}/ciudadFeriados/buscar`, datos);
  }

  BuscarCiudadProvincia(nombre: string){
    return this.http.get(`${this.API_URL}/ciudadFeriados/${nombre}`);
  }
  
}
