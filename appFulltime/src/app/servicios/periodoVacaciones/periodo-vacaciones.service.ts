import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PeriodoVacacionesService {
  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Período de Vacaciones

  ConsultarPerVacaciones() {
    return this.http.get(`${this.API_URL}/perVacacion`);
  }

  CrearPerVacaciones(datos: any) {
    return this.http.post(`${this.API_URL}/perVacacion`, datos);
  }

  BuscarIDPerVacaciones(id: number) {
    return this.http.get(`${this.API_URL}/perVacacion/buscar/${id}`);
  }

  getInfoPeriodoVacacionesPorIdContrato(id_empl_contrato: number) {
    return this.http.get<any>(`${this.API_URL}/perVacacion/infoPeriodo/${id_empl_contrato}`);
  }

  ActualizarPeriodoV(datos: any) {
    return this.http.put(`${this.API_URL}/perVacacion`, datos);
  }

  CargarPeriodosMultiples(formData) {
    return this.http.post(`${this.API_URL}/perVacacion/cargarPeriodo/upload`, formData);
  }

}
