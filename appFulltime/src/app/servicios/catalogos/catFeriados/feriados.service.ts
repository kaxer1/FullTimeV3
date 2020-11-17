import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeriadosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo feriado
  CrearNuevoFeriado(datos: any) {
    return this.http.post(`${this.API_URL}/feriados`, datos)
      .pipe(
        catchError(datos)
      );
  }

  ConsultarFeriado() {
    return this.http.get(`${this.API_URL}/feriados`);
  }

  ConsultarFeriadoActualiza(id: number) {
    return this.http.get(`${this.API_URL}/feriados/listar/${id}`);
  }

  ConsultarUnFeriado(id: number) {
    return this.http.get(`${this.API_URL}/feriados/${id}`);
  }

  ActualizarUnFeriado(datos: any) {
    return this.http.put(`${this.API_URL}/feriados`, datos)
      .pipe(
        catchError(datos)
      );
  }

  ConsultarUltimoId() {
    return this.http.get(`${this.API_URL}/feriados/ultimoId`);
  }

  subirArchivoExcel(formData) {
    return this.http.post<any>(this.API_URL + '/feriados/upload', formData);
  }

  RevisarArchivo(formData) {
    return this.http.post<any>(this.API_URL + '/feriados/upload/revision', formData);
  }

  RevisarArchivoDatos(formData) {
    return this.http.post<any>(this.API_URL + '/feriados/upload/revision_data', formData);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/feriados/xmlDownload`, data);
  }

  EliminarFeriado(id: number) {
    return this.http.delete(`${this.API_URL}/feriados/delete/${id}`);
  }
}
