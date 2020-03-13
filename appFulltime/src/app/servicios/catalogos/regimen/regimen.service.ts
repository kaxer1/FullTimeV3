import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegimenService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo régimen laboral
  CrearNuevoRegimen(datos: any) {
    return this.http.post(`${this.API_URL}/regimenLaboral`, datos);
  }

  ConsultarRegimen(){
    return this.http.get(`${this.API_URL}/regimenLaboral`);
  }
}
