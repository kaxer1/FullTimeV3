import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RelojesService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo reloj
  CrearNuevoReloj(datos: any) {
    return this.http.post(`${this.API_URL}/relojes`, datos);
  }

  ConsultarRelojes() {
    return this.http.get(`${this.API_URL}/relojes`);
  }

  ConsultarUnReloj(id: number) {
    return this.http.get(`${this.API_URL}/relojes/${id}`);
  }

  ActualizarDispositivo(datos: any) {
    return this.http.put(`${this.API_URL}/relojes`, datos);
  }

  subirArchivoExcel(formData) {
    return this.http.post(`${this.API_URL}/relojes/plantillaExcel/`, formData);
  }
}
