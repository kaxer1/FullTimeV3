import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  sendNotiRealTime(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/vacaciones/${id}/estado`, datos);
  }

  ObtenerListaVacaciones() {
    return this.http.get(`${this.API_URL}/vacaciones`);
  }
  
  ObtenerUnaVacacion(id: number) {
    return this.http.get(`${this.API_URL}/vacaciones/one/${id}`);
  }

  RegistrarVacaciones(datos: any) {
    return this.http.post(`${this.API_URL}/vacaciones`, datos);
  }

  ObtenerVacacionesPorIdPeriodo(id_peri_perido: number) {
    return this.http.get<any>(`${this.API_URL}/vacaciones/${id_peri_perido}`)
  }

  BuscarFechasFeriado(datos: any) {
    return this.http.post(`${this.API_URL}/vacaciones/fechasFeriado`, datos);
  }

  BuscarDatosSolicitud(id_emple_vacacion: number) {
    return this.http.get(`${this.API_URL}/vacaciones/datosSolicitud/${id_emple_vacacion}`);
  }

  BuscarDatosAutorizacion(id_vacaciones: number, id_empleado: number) {
    return this.http.get(`${this.API_URL}/vacaciones/datosAutorizacion/${id_vacaciones}/${id_empleado}`);
  }

  SendMailNoti(datos: any) {
    return this.http.post(`${this.API_URL}/vacaciones/mail-noti`, datos);
  }
}
