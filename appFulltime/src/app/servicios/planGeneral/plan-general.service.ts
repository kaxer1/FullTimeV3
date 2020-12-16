import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanGeneralService {

  API_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
  ) { }

  CrearPlanGeneral(datos: any) {
    return this.http.post(`${this.API_URL}/planificacion_general/`, datos);
  }

  EliminarRegistro(id: number,) {
    return this.http.delete(`${this.API_URL}/planificacion_general/eliminar/${id}`);
  }

  BuscarFechas(datos: any) {
    return this.http.post(`${this.API_URL}/planificacion_general/buscar_fechas`, datos);
  }

  BuscarFecha(datos: any) {
    return this.http.post(`${this.API_URL}/planificacion_general/buscar_fecha/plan`, datos);
  }

}
