import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotiAutorizacionesService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getNotiAutoriRest(){
    return this.http.get<any>(`${this.API_URL}/noti-autorizaciones`);
  }

  getOneNotiAutorioRest(id:number){
    return this.http.get<any>(`${this.API_URL}/noti-autorizaciones/${id}`);
  }
  
  getListaNotiAutorioRest(id_notificacion: number){
    return this.http.get<any>(`${this.API_URL}/noti-autorizaciones/lista/${id_notificacion}`);
  }
  
  postNotiAutoriRest(data: any){
    return this.http.post(`${this.API_URL}/noti-autorizaciones`, data);
  } 
}
