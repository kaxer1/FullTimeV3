import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanComidasService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  // Planificación Comidas

  CrearPlanComidas(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/`, datos);
  }

  obtenerPlanComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${this.API_URL}/planComidas/infoComida/${id_empleado}`)
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/planComidas/eliminar/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/planComidas`, datos);
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

  /** Alertas Notificación y envio de correo electrónico */
  EnviarMensajePlanComida(data: any) {
    return this.http.post<any>(`${this.API_URL}/planComidas/send/planifica/`, data);
  }

}
