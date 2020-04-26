import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getSucursalesRest(){
    return this.http.get<any>(`${this.API_URL}/sucursales`);
  }

  getOneSucursalRest(id:number){
    return this.http.get<any>(`${this.API_URL}/sucursales/${id}`);
  }
  
  postSucursalRest(data: any){
    return this.http.post(`${this.API_URL}/sucursales`, data);
  } 
}
