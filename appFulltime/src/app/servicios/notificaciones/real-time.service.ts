import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    // private socket: Socket
  ) { }

  ObtenerTodasNotificaciones() {
    return this.http.get(`${this.API_URL}/noti-real-time/`);
  }

  ObtenerUnaNotificaciones(id: number) {
    return this.http.get(`${this.API_URL}/noti-real-time/one/${id}`);
  }

  ObtenerNotificacionesSend(id_empleado: number) {
    return this.http.get(`${this.API_URL}/noti-real-time/send/${id_empleado}`);
  }
  
  ObtenerNotificacionesReceives(id_empleado: number) {
    return this.http.get(`${this.API_URL}/noti-real-time/receives/${id_empleado}`);
  }
  
  ObtenerNotificacionesAllReceives(id_empleado: number) {
    return this.http.get(`${this.API_URL}/noti-real-time/all-receives/${id_empleado}`);
  }

  IngresarNotificacionEmpleado(datos: any) {
    return this.http.post(`${this.API_URL}/noti-real-time`, datos);
  }

  PutVistaNotificacion(id_realtime: number) {
    let data = {visto:true};
    return this.http.put(`${this.API_URL}/noti-real-time/vista/${id_realtime}`, data);
  }

  /*
    METODOS PARA CONFIG_NOTI
  */

  ObtenerConfigNotiEmpleado(id_empleado: number) {
    return this.http.get(`${this.API_URL}/noti-real-time/config/${id_empleado}`);
  }

  IngresarConfigNotiEmpleado(datos: any) {
    return this.http.post(`${this.API_URL}/noti-real-time/config`, datos);
  }

  ActualizarConfigNotiEmpl(id_empleado: number, datos: any) {
    return this.http.put(`${this.API_URL}/noti-real-time/config/noti-put/${id_empleado}`, datos);
  }
}
