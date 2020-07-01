import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  NOTIFICACIONES_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de notificaciones
  getNotificacionesRest() {
    return this.http.get(`${this.NOTIFICACIONES_URL}/notificaciones`);
  }

  postNotificacionesRest(data: any) {
    return this.http.post(`${this.NOTIFICACIONES_URL}/notificaciones`, data).pipe(
      catchError(data)
    );
  }

  BuscarNotificacionPermiso(id: number) {
    return this.http.get(`${this.NOTIFICACIONES_URL}/notificaciones/notificacionPermiso/${id}`);
  }
}
