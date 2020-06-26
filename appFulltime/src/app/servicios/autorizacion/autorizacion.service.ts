import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  AUTORIZACIONES_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  sendNotiRealTimeEstado(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  // catalogo de notificaciones
  getAutorizacionesRest(){
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones`);
  }

  getUnaAutorizacionPorPermisoRest(id_documento: number){
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones/info-autorizacion/${id_documento}`);
  }

  postAutorizacionesRest(data: any){
    return this.http.post(`${this.AUTORIZACIONES_URL}/autorizaciones`, data);
  }

  ActualizarEstadoAutorizacion(id: number, datos: any) {
    return this.http.put(`${this.AUTORIZACIONES_URL}/autorizaciones/${id}/estado`, datos);
  }
}
