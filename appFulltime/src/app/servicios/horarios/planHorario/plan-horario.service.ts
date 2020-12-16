import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanHorarioService {

  API_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerPlanHorario() {
    return this.http.get(`${this.API_URL}/planHorario`);
  }

  RegistrarPlanHorario(datos: any) {
    return this.http.post(`${this.API_URL}/planHorario`, datos);
  }

  BuscarIDPlanHorario(id: number) {
    return this.http.get(`${this.API_URL}/planHorario/buscar/${id}`);
  }

  ObtenerPlanHorarioPorIdCargo(id: number) {
    return this.http.get<any>(`${this.API_URL}/planHorario/infoPlan/${id}`);
  }

  ObtenerPlanHorarioPorId(id: number) {
    return this.http.get<any>(`${this.API_URL}/planHorario/datosPlanHorario/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/planHorario/`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/planHorario/eliminar/${id}`);
  }

  ObtenerPlanHorarioEmpleadoFechas(id_empleado: number, datos: any) {
    return this.http.post(`${this.API_URL}/planHorario/fechas_plan/${id_empleado}`, datos);
  }

  VerificarDuplicidadPlan(datos: any, codigo: number,) {
    return this.http.post(`${this.API_URL}/planHorario/validarFechas/${codigo}`, datos);
  }

  VerificarDuplicidadPlanEdicion(id: number, codigo: number, datos: any) {
    return this.http.post(`${this.API_URL}/planHorario/validarFechas/horarioEmpleado/${id}/empleado/${codigo}`, datos);
  }
}
