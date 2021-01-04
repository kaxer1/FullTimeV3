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

  ObtenerPlanHoraDetallePorIdPlanHorario(id_plan_horario: number) {
    return this.http.get<any>(`${this.API_URL}/detallePlanHorario/infoPlan/${id_plan_horario}`);
  }

  ActualizarRegistro(data: any) {
    return this.http.put(`${this.API_URL}/detallePlanHorario`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/detallePlanHorario/eliminar/${id}`);
  }

  VerificarDuplicidad(datos: any) {
    return this.http.post(`${this.API_URL}/detallePlanHorario/verificarRegistro`, datos);
  }

  VerificarDuplicidadEdicion(datos: any, id: number) {
    return this.http.post(`${this.API_URL}/detallePlanHorario/verificarDuplicado/${id}`, datos);
  }

  // Verificar Datos de detalle de plantilla
  VerificarDatos(id_plan_horario: number, formData) {
    return this.http.post<any>(`${this.API_URL}/detallePlanHorario/verificarDatos/${id_plan_horario}/upload`, formData)
  }
  VerificarPlantilla(formData) {
    return this.http.post<any>(`${this.API_URL}/detallePlanHorario/verificarPlantilla/upload`, formData)
  }
  subirArchivoExcel(id_plan_horario: number, formData) {
    return this.http.post<any>(`${this.API_URL}/detallePlanHorario/${id_plan_horario}/upload`, formData)
  }
  CrearPlanificacionGeneral(id: number, codigo: number, formData) {
    return this.http.post<any>(`${this.API_URL}/detallePlanHorario/plan_general/${id}/${codigo}/upload`, formData)
  }
}
