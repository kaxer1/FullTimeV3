import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetallePlanHorarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerDetallesPlanHorario() {
    return this.http.get(`${this.API_URL}/detallePlanHorario`);
  }

  RegistrarDetallesPlanHorario(datos: any) {
    return this.http.post(`${this.API_URL}/detallePlanHorario`, datos);
  }

  ObtenerPlanHoraDetallePorIdPlanHorario(id_plan_horario: number){
    return this.http.get<any>(`${this.API_URL}/detallePlanHorario/infoPlan/${id_plan_horario}`);
  }

}
