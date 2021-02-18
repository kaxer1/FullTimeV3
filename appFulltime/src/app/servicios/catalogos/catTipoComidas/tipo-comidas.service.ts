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

  ConsultarMenu(id: number) {
    return this.http.get(`${this.API_URL}/tipoComidas/${id}`);
  }

  ConsultarUnMenu(id: number) {
    return this.http.get(`${this.API_URL}/tipoComidas/buscar/menu/${id}`);
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

  ObtenerUltimoId() {
    return this.http.get(`${this.API_URL}/tipoComidas/registro/ultimo`);
  }

  // Servicio para consultar datos de tabla detalle_menu
  ConsultarUnDetalleMenu(id: number) {
    return this.http.get(`${this.API_URL}/tipoComidas/detalle/menu/${id}`);
  }

  CrearDetalleMenu(datos: any) {
    return this.http.post(`${this.API_URL}/tipoComidas/detalle/menu`, datos);
  }

  ActualizarDetalleMenu(datos: any) {
    return this.http.put(`${this.API_URL}/tipoComidas/detalle/menu`, datos);
  }

  EliminarDetalleMenu(id: number) {
    return this.http.delete(`${this.API_URL}/tipoComidas/detalle/menu/eliminar/${id}`);
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
