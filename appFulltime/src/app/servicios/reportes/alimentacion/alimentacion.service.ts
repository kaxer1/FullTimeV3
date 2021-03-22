import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AlimentacionService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerPlanificadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/planificados`, datos);
  }

  ObtenerSolicitadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/solicitados`, datos);
  }

  ObtenerExtrasPlanConsumidos(data: any) {
    return this.http.post(`${this.API_URL}/alimentacion/extras/plan`, data)
  }

  ObtenerExtrasSolConsumidos(data: any) {
    return this.http.post(`${this.API_URL}/alimentacion/extras/solicita`, data)
  }

  ObtenerDetallesPlanificadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/planificados/detalle`, datos);
  }

  ObtenerDetallesSolicitadosConsumidos(datos: any) {
    return this.http.post(`${this.API_URL}/alimentacion/solicitados/detalle`, datos);
  }

  ObtenerDetallesExtrasPlanConsumidos(data: any) {
    return this.http.post(`${this.API_URL}/alimentacion/extras/detalle/plan`, data)
  }

  ObtenerDetallesExtrasSolConsumidos(data: any) {
    return this.http.post(`${this.API_URL}/alimentacion/extras/detalle/solicita`, data)
  }

}
