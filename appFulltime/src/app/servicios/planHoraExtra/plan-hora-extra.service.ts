import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanHoraExtraService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  CrearPlanificacionHoraExtra(data: any) {
    return this.http.post(`${this.API_URL}/planificacionHoraExtra`, data);
  }
}
