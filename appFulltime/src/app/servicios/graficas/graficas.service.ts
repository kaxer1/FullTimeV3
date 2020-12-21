import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  
  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  MetricaInasistenciaMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/inasistencia/micro`);
  }
  
  MetricaInasistenciaMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/inasistencia/macro/${desde}/${hasta}`);
  }

}
