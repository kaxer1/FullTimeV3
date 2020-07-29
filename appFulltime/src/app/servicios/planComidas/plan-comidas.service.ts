import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanComidasService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Planificación Comidas

  CrearPlanComidas(datos: any) {
    return this.http.post(`${this.API_URL}/planComidas/`, datos);
  }

  obtenerPlanComidaPorIdEmpleado(id_empleado: number) {
    return this.http.get<any>(`${this.API_URL}/planComidas/infoComida/${id_empleado}`)
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/planComidas/eliminar/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/planComidas`, datos);
  }

}
