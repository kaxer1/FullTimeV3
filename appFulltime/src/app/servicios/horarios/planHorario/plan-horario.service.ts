import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanHorarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerPlanHorario() {
    return this.http.get(`${this.API_URL}/planHorario`);
  }

  RegistrarPlanHorario(datos: any) {
    return this.http.post(`${this.API_URL}/planHorario`, datos);
  }

  BuscarIDPlanHorario(id: number){
    return this.http.get(`${this.API_URL}/planHorario/buscar/${id}`);
  }
  
  ObtenerPlanHorarioPorIdCargo(id: number){
    return this.http.get<any>(`${this.API_URL}/planHorario/infoPlan/${id}`);
  }

}
