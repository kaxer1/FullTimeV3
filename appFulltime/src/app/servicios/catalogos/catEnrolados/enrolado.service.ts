import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnroladoService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de enrolados

  getEnroladosRest() {
    return this.http.get(`${this.API_URL}/enrolados`);
  }

  ListarUnEnrolado(id: number) {
    return this.http.get(`${this.API_URL}/enrolados/${id}`);
  }

  postEnroladosRest(data: any) {
    console.log(data)
    return this.http.post(`${this.API_URL}/enrolados`, data);
  }

  BuscarUltimoId() {
    return this.http.get(`${this.API_URL}/enrolados/buscar/ultimoId`);
  }

  BuscarRegistroUsuario(id_usuario: number) {
    return this.http.get(`${this.API_URL}/enrolados/busqueda/${id_usuario}`);
  }

  ActualizarUnEnrolado(datos: any) {
    return this.http.put(`${this.API_URL}/enrolados`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/enrolados/eliminar/${id}`);
  }

  subirArchivoExcel(formData) {
    return this.http.post(`${this.API_URL}/enrolados/plantillaExcel/`, formData);
  }

}