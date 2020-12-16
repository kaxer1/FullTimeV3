import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorasExtrasService {
  HORA_EXTRA_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de horas extras

  postHoraExtraRest(data: any) {
    return this.http.post(`${this.HORA_EXTRA_URL}/horasExtras`, data);
  }

  ListarHorasExtras() {
    return this.http.get(`${this.HORA_EXTRA_URL}/horasExtras`);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.HORA_EXTRA_URL}/horasExtras/eliminar/${id}`);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.HORA_EXTRA_URL}/horasExtras/xmlDownload`, data);
  }

  ObtenerUnaHoraExtra(id: number) {
    return this.http.get(`${this.HORA_EXTRA_URL}/horasExtras/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.HORA_EXTRA_URL}/horasExtras`, datos);
  }
}
