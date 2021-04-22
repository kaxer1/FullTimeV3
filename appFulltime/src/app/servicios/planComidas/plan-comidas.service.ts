import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PlanComidasService {

  constructor(
    private http: HttpClient,
  ) { }

  /** SOLICITUD DE COMIDAS */
  CrearSolicitudComida(datos: any) {
    return this.http.post(`${environment.url}/planComidas/solicitud`, datos);
  }

  ActualizarSolicitudComida(datos: any) {
    return this.http.put(`${environment.url}/planComidas/solicitud`, datos);
  }

  ActualizarEstadoSolicitudComida(datos: any) {
    return this.http.put(`${environment.url}/planComidas/solicitud/estado`, datos);
  }

  ObtenerSolComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${environment.url}/planComidas/infoComida/${id_empleado}`)
  }

  ObtenerSolComidaAprobado() {
    return this.http.get<any>(`${environment.url}/planComidas/infoComida/estado/aprobado`)
  }

  ObtenerSolComidaNegado() {
    return this.http.get<any>(`${environment.url}/planComidas/infoComida/estado/negado`)
  }

  /** BUSCAR JEFES */
  obtenerJefes(id_departamento: number) {
    return this.http.get<any>(`${environment.url}/planComidas/enviar/notificacion/${id_departamento}`)
  }

  /** ENVIAR CORREO A CADA JEFE */
  EnviarCorreo(datos: any) {
    return this.http.post(`${environment.url}/planComidas/mail-noti`, datos);
  }

  /** PLANIFICACIÓN DE COMIDAS */
  CrearPlanComidas(datos: any) {
    return this.http.post(`${environment.url}/planComidas/`, datos);
  }

  ObtenerUltimaPlanificacion() {
    return this.http.get<any>(`${environment.url}/planComidas/fin_registro`)
  }

  ObtenerPlanComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${environment.url}/planComidas/infoComida/plan/${id_empleado}`)
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${environment.url}/planComidas/eliminar/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${environment.url}/planComidas`, datos);
  }

  /** REGISTRO DE LA PLANIFICACIÓN DE ALIMENTACIÓN AL EMPLEADO */
  CrearPlanComidasEmpleado(datos: any) {
    return this.http.post(`${environment.url}/planComidas/empleado/plan`, datos);
  }

  EnviarCorreoPlan(datos: any) {
    return this.http.post(`${environment.url}/planComidas/mail-plan`, datos);
  }

  /** Servicio para obtener datos de la tabla tipo_comida */
  CrearTipoComidas(datos: any) {
    return this.http.post(`${environment.url}/planComidas/tipo_comida`, datos);
  }

  ObtenerTipoComidas() {
    return this.http.get<any>(`${environment.url}/planComidas/tipo_comida`)
  }

  ObtenerUltimoTipoComidas() {
    return this.http.get<any>(`${environment.url}/planComidas/tipo_comida/ultimo`)
  }

  /** ALERTAS DE NOTIFICACIÓN DE SOLICITUD Y PLANIFICACIÓN DE SERVICIO DE ALIMENTACIÓN*/
  EnviarMensajePlanComida(data: any) {
    return this.http.post<any>(`${environment.url}/planComidas/send/planifica/`, data);
  }

}
