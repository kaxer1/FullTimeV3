import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanHorarioService {

  API_URL = 'http://localhost:3000';

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

  VerificarDuplicidadPlan(id_empl: number, datos: any) {
    return this.http.post(`${this.API_URL}/planHorario/validarFechas/${id_empl}`, datos);
  }

  VerificarDuplicidadPlanEdicion(id: number, id_empl: number, datos: any) {
    return this.http.post(`${this.API_URL}/planHorario/validarFechas/horarioEmpleado/${id}/empleado/${id_empl}`, datos);
  }
}
