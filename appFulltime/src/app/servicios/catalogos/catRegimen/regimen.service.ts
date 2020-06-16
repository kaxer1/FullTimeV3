import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegimenService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo régimen laboral
  CrearNuevoRegimen(datos: any) {
    return this.http.post(`${this.API_URL}/regimenLaboral`, datos);
  }

  ConsultarRegimen() {
    return this.http.get(`${this.API_URL}/regimenLaboral`);
  }

  ConsultarUnRegimen(id: number) {
    return this.http.get(`${this.API_URL}/regimenLaboral/${id}`);
  }

  ActualizarRegimen(datos: any) {
    return this.http.put(`${this.API_URL}/regimenLaboral`, datos);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/regimenLaboral/xmlDownload`, data);
  }
}
