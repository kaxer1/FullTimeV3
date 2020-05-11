import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotiAutorizacionesService {

  API_URL = 'http://localhost:3000';

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
  
  postNotiAutoriRest(data: any){
    return this.http.post(`${this.API_URL}/noti-autorizaciones`, data);
  } 
}