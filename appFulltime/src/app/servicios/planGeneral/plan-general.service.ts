import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanGeneralService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  CrearPlanGeneral(datos: any) {
    return this.http.post(`${this.API_URL}/planificacion_general/`, datos);
  }

  EliminarRegistro(codigo: number, datos: any) {
    return this.http.delete(`${this.API_URL}/planificacion_general/eliminar/${codigo}`, datos);
  }

}
