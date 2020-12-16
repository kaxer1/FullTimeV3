import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  AUTORIZACIONES_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  sendNotiRealTimeEstado(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  // catalogo de notificaciones
  getAutorizacionesRest() {
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones`);
  }

  getUnaAutorizacionByPermisoRest(id_permiso: number) {
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones/by-permiso/${id_permiso}`);
  }

  getUnaAutorizacionByVacacionRest(id_vacacion: number) {
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones/by-vacacion/${id_vacacion}`);
  }

  getUnaAutorizacionByHoraExtraRest(id_hora_extra: number) {
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones/by-hora-extra/${id_hora_extra}`);
  }

  postAutorizacionesRest(data: any) {
    return this.http.post(`${this.AUTORIZACIONES_URL}/autorizaciones`, data);
  }

  PutEstadoAutoPermiso(id: number, datos: any) {
    return this.http.put(`${this.AUTORIZACIONES_URL}/autorizaciones/${id}/estado-permiso`, datos);
  }

  PutEstadoAutoPermisoMultiple(datos: any) {
    return this.http.put(`${this.AUTORIZACIONES_URL}/autorizaciones/estado-permiso/multiple`, datos);
  }

  PutEstadoAutoVacacion(datos: any) {
    return this.http.put(`${this.AUTORIZACIONES_URL}/autorizaciones/estado-vacacion`, datos);
  }

  PutEstadoAutoHoraExtra(id: number, datos: any) {
    return this.http.put(`${this.AUTORIZACIONES_URL}/autorizaciones/${id}/estado-hora-extra`, datos);
  }

  PutEstadoAutoPlanHoraExtra(id: number, datos: any) {
    return this.http.put(`${this.AUTORIZACIONES_URL}/autorizaciones/${id}/estado-plan-hora-extra`, datos);
  }
}
