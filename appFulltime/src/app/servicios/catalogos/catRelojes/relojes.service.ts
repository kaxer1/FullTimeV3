import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RelojesService {

  API_URL = 'http://localhost:3000';

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

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/relojes/xmlDownload`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/relojes/eliminar/${id}`);
  }

  ConsultarDatosId(id: number) {
    return this.http.get(`${this.API_URL}/relojes/datosReloj/${id}`);
  }

  // Métodos para verificar datos de plantilla antes de registralos en el sistema
  subirArchivoExcel(formData) {
    return this.http.post<any>(`${this.API_URL}/relojes/plantillaExcel/`, formData);
  }

  Verificar_Datos_ArchivoExcel(formData) {
    return this.http.post<any>(`${this.API_URL}/relojes/verificar_datos/plantillaExcel/`, formData);
  }

  VerificarArchivoExcel(formData) {
    return this.http.post<any>(`${this.API_URL}/relojes/verificar_plantilla/plantillaExcel/`, formData);
  }
}
