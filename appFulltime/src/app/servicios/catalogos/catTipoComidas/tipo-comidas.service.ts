import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoComidasService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo tipo de comida
  CrearNuevoTipoComida(datos: any) {
    return this.http.post(`${this.API_URL}/tipoComidas`, datos);
  }

  ConsultarTipoComida() {
    return this.http.get(`${this.API_URL}/tipoComidas`);
  }

  ActualizarUnAlmuerzo(datos: any) {
    return this.http.put(`${this.API_URL}/tipoComidas`, datos);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/tipoComidas/xmlDownload`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/tipoComidas/eliminar/${id}`);
  }

  // Servicios para verificar y subir datos
  subirArchivoExcel(formData) {
    return this.http.post<any>(this.API_URL + '/tipoComidas/upload', formData)
  }

  Verificar_Datos_ArchivoExcel(formData) {
    return this.http.post<any>(this.API_URL + '/tipoComidas/verificar_datos/upload', formData)
  }

  VerificarArchivoExcel(formData) {
    return this.http.post<any>(this.API_URL + '/tipoComidas/verificar_plantilla/upload', formData)
  }
}
