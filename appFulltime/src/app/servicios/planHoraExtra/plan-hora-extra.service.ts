import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanHoraExtraService {

  API_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
  ) { }

  ConsultarPlanificaciones() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/planificaciones`);
  }

  CrearPlanificacionHoraExtra(data: any) {
    return this.http.post(`${this.API_URL}/planificacionHoraExtra`, data);
  }

  ActualizarPlanHoraExtra(id: number, datos: any) {
    return this.http.put<any>(`${this.API_URL}/planificacionHoraExtra/planificacion/${id}`, datos);
  }

  AutorizarTiempoHoraExtra(id: number, hora: any) {
    return this.http.put<any>(`${this.API_URL}/planificacionHoraExtra/tiempo-autorizado/${id}`, hora);
  }

  ConsultarPlanHoraExtra() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra`);
  }

  ConsultarUltimoPlanHora() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/id_plan_hora`);
  }

  ConsultarPlanHoraExtraObservacion() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/justificar`);
  }

  ConsultarPlanHoraExtraAutorizada() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/autorizacion`);
  }

  EditarObservacion(id: number, datos: any) {
    return this.http.put<any>(`${this.API_URL}/planificacionHoraExtra/observacion/${id}`, datos);
  }

  EditarEstado(id: number, datos: any) {
    return this.http.put<any>(`${this.API_URL}/planificacionHoraExtra/estado/${id}`, datos);
  }

  EnviarMensajeJustificacion(data: any) {
    return this.http.post<any>(`${this.API_URL}/planificacionHoraExtra/send/aviso/`, data);
  }

  EnviarMensajePlanificacion(data: any) {
    return this.http.post<any>(`${this.API_URL}/planificacionHoraExtra/send/planifica/`, data);
  }

  BuscarDatosAutorizacion(id_hora_extra: number) {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/datosAutorizacion/${id_hora_extra}`);
  }

  // TABLA plan_hora_extra_empleado
  CrearPlanHoraExtraEmpleado(data: any) {
    return this.http.post(`${this.API_URL}/planificacionHoraExtra/hora_extra_empleado`, data);
  }

  BuscarPlanEmpleados(id_plan_hora: number) {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/plan_empleado/${id_plan_hora}`);
  }
}
