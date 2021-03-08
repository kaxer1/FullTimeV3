import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class AlimentacionService {

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerPlanificadosConsumidos(datos: any) {
    return this.http.post(`${environment.url}/alimentacion/planificados`, datos);
  }

  ObtenerSolicitadosConsumidos(datos: any) {
    return this.http.post(`${environment.url}/alimentacion/solicitados`, datos);
  }

  ObtenerExtrasConsumidos(data: any) {
    return this.http.post(`${environment.url}/alimentacion/extras`, data)
  }

  ObtenerDetallesPlanificadosConsumidos(datos: any) {
    return this.http.post(`${environment.url}/alimentacion/planificados/detalle`, datos);
  }

  ObtenerDetallesSolicitadosConsumidos(datos: any) {
    return this.http.post(`${environment.url}/alimentacion/solicitados/detalle`, datos);
  }

  ObtenerDetallesExtrasConsumidos(data: any) {
    return this.http.post(`${environment.url}/alimentacion/extras/detalle`, data)
  }

}
