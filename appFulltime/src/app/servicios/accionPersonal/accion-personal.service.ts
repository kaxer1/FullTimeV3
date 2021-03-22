import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccionPersonalService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  /** SERVICIOS PARA TABLA TIPO_ACCION_PERSONAL */
  ConsultarTipoAccionPersonal() {
    return this.http.get(`${this.API_URL}/accionPersonal`);
  }

  IngresarTipoAccionPersonal(datos: any) {
    return this.http.post(`${this.API_URL}/accionPersonal`, datos);
  }

  BuscarTipoAccionPersonalId(id: any) {
    return this.http.get(`${this.API_URL}/accionPersonal/tipo/accion/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/accionPersonal`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/accionPersonal/eliminar/${id}`);
  }

}
