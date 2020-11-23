import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegimenService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo régimen laboral
  CrearNuevoRegimen(datos: any) {
    return this.http.post(`${this.API_URL}/regimenLaboral`, datos).pipe(
      catchError(datos));
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

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/regimenLaboral/eliminar/${id}`);
  }
}
