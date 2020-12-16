import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CiudadesFeriadoService {

  API_URL = 'http://186.71.19.82:3001';

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

  BuscarCiudadesFeriado(id: number){
    return this.http.get(`${this.API_URL}/ciudadFeriados/nombresCiudades/${id}`);
  }

  ActualizarDatos(data: any) {
    return this.http.put(`${this.API_URL}/ciudadFeriados`, data);
  }

  EliminarRegistro(id: number){
    return this.http.delete(`${this.API_URL}/ciudadFeriados/eliminar/${id}`);
  }

  BuscarFeriados(id_ciudad: number){
    return this.http.get(`${this.API_URL}/ciudadFeriados/ciudad/${id_ciudad}`);
  }
}
