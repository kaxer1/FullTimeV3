import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TituloService {
  TITULO_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  // Catálogo de títulos

  getOneTituloRest(id: number) {
    return this.http.get(`${this.TITULO_URL}/titulo/${id}`);
  }

  getTituloRest() {
    return this.http.get(`${this.TITULO_URL}/titulo/`);
  }

  postTituloRest(data: any) {
    console.log(data);
    return this.http.post(`${this.TITULO_URL}/titulo`, data);
  }

  ActualizarUnTitulo(datos: any) {
    return this.http.put(`${this.TITULO_URL}/titulo`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.TITULO_URL}/titulo/eliminar/${id}`);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.TITULO_URL}/titulo/xmlDownload`, data);
  }

}
