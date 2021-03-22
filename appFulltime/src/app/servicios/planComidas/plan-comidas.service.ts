import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanComidasService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  /** SOLICITUD DE COMIDAS */
  CrearSolicitudComida(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/solicitud`, datos);
  }

  ActualizarSolicitudComida(datos: any) {
    return this.http.put(`${this.API_URL}/planComidas/solicitud`, datos);
  }

  ObtenerSolComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${this.API_URL}/planComidas/infoComida/${id_empleado}`)
  }

  /** BUSCAR JEFES */
  obtenerJefes(id_departamento: number) {
    return this.http.get<any>(`${this.API_URL}/planComidas/enviar/notificacion/${id_departamento}`)
  }

  /** ENVIAR CORREO A CADA JEFE */
  EnviarCorreo(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/mail-noti`, datos);
  }

  /** PLANIFICACIÓN DE COMIDAS */
  CrearPlanComidas(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/`, datos);
  }

  ObtenerUltimaPlanificacion() {
    return this.http.get<any>(`${this.API_URL}/planComidas/fin_registro`)
  }

  ObtenerPlanComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${this.API_URL}/planComidas/infoComida/plan/${id_empleado}`)
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/planComidas/eliminar/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/planComidas`, datos);
  }

  /** REGISTRO DE LA PLANIFICACIÓN DE ALIMENTACIÓN AL EMPLEADO */
  CrearPlanComidasEmpleado(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/empleado/plan`, datos);
  }

  EnviarCorreoPlan(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/mail-plan`, datos);
  }

  /** Servicio para obtener datos de la tabla tipo_comida */
  CrearTipoComidas(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/tipo_comida`, datos);
  }

  ObtenerTipoComidas() {
    return this.http.get<any>(`${this.API_URL}/planComidas/tipo_comida`)
  }

  ObtenerUltimoTipoComidas() {
    return this.http.get<any>(`${this.API_URL}/planComidas/tipo_comida/ultimo`)
  }

  /** ALERTAS DE NOTIFICACIÓN DE SOLICITUD Y PLANIFICACIÓN DE SERVICIO DE ALIMENTACIÓN*/
  EnviarMensajePlanComida(data: any) {
    return this.http.post<any>(`${this.API_URL}/planComidas/send/planifica/`, data);
  }

}
