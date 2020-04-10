import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanComidasService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Planificación Comidas

  CrearPlanComidas(datos: any){ 
    return this.http.post(`${this.API_URL}/planComidas/`, datos);
  }

}
