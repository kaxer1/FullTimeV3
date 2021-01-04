import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  
  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  MetricaInasistencia() {
    return this.http.get<any>(`${this.API_URL}/metricas/inasistencia`);
  }
}
