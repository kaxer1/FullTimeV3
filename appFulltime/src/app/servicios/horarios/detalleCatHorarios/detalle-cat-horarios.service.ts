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
  
}
