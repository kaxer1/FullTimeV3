import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AlimentacionService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerPlanificadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/planificados`, datos);
  }

  ObtenerSolicitadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/solicitados`, datos);
  }

  ObtenerExtrasConsumidos(data: any) {
    return this.http.post(`${this.API_URL}/alimentacion/extras`, data)
  }

  ObtenerDetallesPlanificadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/planificados/detalle`, datos);
  }

  ObtenerDetallesSolicitadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/solicitados/detalle`, datos);
  }

  ObtenerDetallesExtrasConsumidos(data: any) {
    return this.http.post(`${this.API_URL}/alimentacion/extras/detalle`, data)
  }

}
