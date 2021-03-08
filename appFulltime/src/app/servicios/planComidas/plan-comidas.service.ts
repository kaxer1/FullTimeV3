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

  // Planificación Comidas

  CrearPlanComidas(datos: any) {
    return this.http.post(`${environment.url}/planComidas/`, datos);
  }

  obtenerPlanComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${environment.url}/planComidas/infoComida/${id_empleado}`)
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${environment.url}/planComidas/eliminar/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${environment.url}/planComidas`, datos);
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

  /** Alertas Notificación y envio de correo electrónico */
  EnviarMensajePlanComida(data: any) {
    return this.http.post<any>(`${environment.url}/planComidas/send/planifica/`, data);
  }

}
