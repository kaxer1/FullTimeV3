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

  ObtenerExtrasPlanConsumidos(data: any) {
    return this.http.post(`${environment.url}/alimentacion/extras/plan`, data)
  }

  ObtenerExtrasSolConsumidos(data: any) {
    return this.http.post(`${environment.url}/alimentacion/extras/solicita`, data)
  }

  ObtenerDetallesPlanificadosConsumidos(datos: any) {
    return this.http.post(`${environment.url}/alimentacion/planificados/detalle`, datos);
  }

  ObtenerDetallesSolicitadosConsumidos(datos: any) {
    return this.http.post(`${environment.url}/alimentacion/solicitados/detalle`, datos);
  }

  ObtenerDetallesExtrasPlanConsumidos(data: any) {
    return this.http.post(`${environment.url}/alimentacion/extras/detalle/plan`, data)
  }

  ObtenerDetallesExtrasSolConsumidos(data: any) {
    return this.http.post(`${environment.url}/alimentacion/extras/detalle/solicita`, data)
  }

}
