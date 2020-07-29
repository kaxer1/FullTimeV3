import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DocumentosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  ListarArchivos() {
    return this.http.get(`${this.API_URL}/archivosCargados`);
  }

  ListarUnArchivo(id: number) {
    return this.http.get(`${this.API_URL}/archivosCargados/${id}`);
  }

  CrearArchivo(data: any) {
    return this.http.post(`${this.API_URL}/archivosCargados`, data);
  }

  EditarArchivo(id: number, data: any) {
    return this.http.put(`${this.API_URL}/archivosCargados/editar/${id}`, data);
  }

  SubirArchivo(formData, id: number) {
    return this.http.put(`${this.API_URL}/archivosCargados/${id}/documento`, formData)
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/archivosCargados/eliminar/${id}`);
  }

}
