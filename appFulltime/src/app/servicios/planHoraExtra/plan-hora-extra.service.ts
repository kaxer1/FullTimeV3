import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanHoraExtraService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  CrearPlanificacionHoraExtra(data: any) {
    return this.http.post(`${this.API_URL}/planificacionHoraExtra`, data);
  }

  AutorizarTiempoHoraExtra(id: number, hora: any) {
    return this.http.put<any>(`${this.API_URL}/planificacionHoraExtra/tiempo-autorizado/${id}`, hora);
  }

  ConsultarPlanHoraExtra() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra`);
  }

  ConsultarPlanHoraExtraObservacion() {
    return this.http.get(`${this.API_URL}/planificacionHoraExtra/justificar`);
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
}
