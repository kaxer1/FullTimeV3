import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  NOTIFICACIONES_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de notificaciones
  getNotificacionesRest(){
    return this.http.get(`${this.NOTIFICACIONES_URL}/notificaciones`);
  }

  postNotificacionesRest(data: any){
    return this.http.post(`${this.NOTIFICACIONES_URL}/notificaciones`, data);
  }
}
