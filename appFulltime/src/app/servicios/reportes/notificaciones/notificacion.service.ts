import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerPermisosEnviados(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/permisos_enviados/${id}`);
  }

  ObtenerPermisosRecibidos(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/permisos_recibidos/${id}`);
  }

  ObtenerHorasExtrasEnviados(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/solicita_extra_enviados/${id}`);
  }

  ObtenerHorasExtrasRecibidas(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/solicita_extra_recibidos/${id}`);
  }

  ObtenerVacacionesEnviadas(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/vacaciones_enviados/${id}`);
  }

  ObtenerVacacionesRecibidas(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/vacaciones_recibidos/${id}`);
  }

  ObtenerPalnificacionesEnviadas(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/planificaciones_enviadas/${id}`);
  }

  ObtenerPlanificacionesEliminadas(id: number) {
    return this.http.get(`${environment.url}/notificacionSistema/planificaciones_eliminadas/${id}`);
  }
}
