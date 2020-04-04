import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  NOTIFICACIONES_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de notificaciones

  postNotificacionesRest(data: any){
    console.log(data);
      return this.http.post(`${this.NOTIFICACIONES_URL}/notificaciones`, data);
  }
}
