import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnroladosRelojesService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Asignar Ciudad Feriado

  CrearEnroladoReloj(datos: any) {
    return this.http.post(`${this.API_URL}/enroladosRelojes/insertar`, datos);
  }

  BuscarIdReloj(datos: any) {
    return this.http.post(`${this.API_URL}/enroladosRelojes/buscar`, datos);
  }

  BuscarEnroladosReloj(id: number) {
    return this.http.get(`${this.API_URL}/enroladosRelojes/nombresReloj/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/enroladosRelojes`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/enroladosRelojes/eliminar/${id}`);
  }

}
