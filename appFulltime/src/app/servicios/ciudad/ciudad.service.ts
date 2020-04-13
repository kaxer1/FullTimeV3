import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de departamentos

  ConsultarNombreCiudades(){
    return this.http.get(`${this.API_URL}/ciudades`);
  }

  getUnaCiudadRest(id: number){
    return this.http.get(`${this.API_URL}/ciudades/${id}`);
  }

  ConsultarCiudades(){
    return this.http.get(`${this.API_URL}/ciudades/listaCiudad`);
  }

  postCiudades(data: any){ 
    return this.http.post(`${this.API_URL}/ciudades`, data);
  }

}
