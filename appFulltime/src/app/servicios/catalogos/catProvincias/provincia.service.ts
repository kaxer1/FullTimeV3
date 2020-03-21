import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Provincias

  getProvinciasRest(){
    return this.http.get(`${this.API_URL}/provincia`);
  }

  getOneProvinciaRest(id:number){
    return this.http.get(`${this.API_URL}/provincia/${id}`);
  }
  
  postProvinciaRest(data: any){
    return this.http.post(`${this.API_URL}/provincia`, data);
  }

  getIdProvinciaRest(nombre: string){
    return this.http.get(`${this.API_URL}/provincia/nombreProvincia/${nombre}`);
  }

}

