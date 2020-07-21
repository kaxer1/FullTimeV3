import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetallePlanHorarioService {

  API_URL = 'http://192.168.0.192:3001';

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
  
  subirArchivoExcel(id_plan_horario: number, formData) {
    return this.http.post(`${this.API_URL}/detallePlanHorario/${id_plan_horario}/upload`, formData)  
  }
}
