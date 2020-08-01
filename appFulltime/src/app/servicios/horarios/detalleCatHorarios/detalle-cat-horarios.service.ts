import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleCatHorariosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Detalle Horario 

  ConsultarDetalleHorario() {
    return this.http.get(`${this.API_URL}/detalleHorario`);
  }

  IngresarDetalleHorarios(datos: any) {
    return this.http.post(`${this.API_URL}/detalleHorario`, datos);
  }

  ConsultarUnDetalleHorario(id: number) {
    return this.http.get(`${this.API_URL}/detalleHorario/${id}`);
  }

  subirArchivoExcel(formData) {
    return this.http.post(this.API_URL + '/detalleHorario/upload', formData)
  }

  ActualizarRegistro(data: any) {
    return this.http.put(`${this.API_URL}/detalleHorario`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/detalleHorario/eliminar/${id}`);
  }

}
