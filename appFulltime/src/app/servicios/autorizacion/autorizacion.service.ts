import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  AUTORIZACIONES_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de notificaciones
  getAutorizacionesRest(){
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones`);
  }

  getUnaAutorizacionRest(id: number){
    return this.http.get<any>(`${this.AUTORIZACIONES_URL}/autorizaciones/${id}`);
  }

  postAutorizacionesRest(data: any){
    return this.http.post(`${this.AUTORIZACIONES_URL}/autorizaciones`, data);
  }
}
