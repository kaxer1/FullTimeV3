import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccionPersonalService {

  constructor(
    private http: HttpClient,
  ) { }

  /** SERVICIOS PARA TABLA TIPO_ACCION_PERSONAL */
  ConsultarTipoAccionPersonal() {
    return this.http.get(`${environment.url}/accionPersonal`);
  }

  IngresarTipoAccionPersonal(datos: any) {
    return this.http.post(`${environment.url}/accionPersonal`, datos);
  }

  BuscarTipoAccionPersonalId(id: any) {
    return this.http.get(`${environment.url}/accionPersonal/tipo/accion/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${environment.url}/accionPersonal`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${environment.url}/accionPersonal/eliminar/${id}`);
  }

}
