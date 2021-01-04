import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmpleadoHorariosService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  //Horarios Empleado

  ConsultarEmpleadoHorarios() {
    return this.http.get(`${this.API_URL}/empleadoHorario`);
  }

  IngresarEmpleadoHorarios(datos: any) {
    return this.http.post(`${this.API_URL}/empleadoHorario`, datos);
  }

  BuscarHorarioCargo(id: any) {
    return this.http.get(`${this.API_URL}/empleadoHorario/horarioCargo/${id}`);
  }

  CargaMultiple(formData) {
    return this.http.post(`${this.API_URL}/empleadoHorario/cargaMultiple`, formData)
  }

  BuscarNumeroHoras(datos: any) {
    return this.http.post(`${this.API_URL}/empleadoHorario/horas`, datos);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/empleadoHorario`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/empleadoHorario/eliminar/${id}`);
  }

  ObtenerHorariosFechasEmpleado(id_empleado: number, data: any) {
    return this.http.post(`${this.API_URL}/empleadoHorario/fechas_horario/${id_empleado}`, data)
  }

  VerificarDuplicidadHorarios(id_empl: number, datos: any) {
    return this.http.post(`${this.API_URL}/empleadoHorario/validarFechas/${id_empl}`, datos);
  }

  VerificarDuplicidadHorariosEdicion(id: number, codigo: number, datos: any) {
    return this.http.post(`${this.API_URL}/empleadoHorario/validarFechas/horarioEmpleado/${id}/empleado/${codigo}`, datos);
  }

  // Verificar datos de la plantilla de horario fijo
  VerificarDatos_EmpleadoHorario(formData: any, id: number) {
    console.log('entra')
    return this.http.post<any>(`${this.API_URL}/empleadoHorario/revisarData/${id}`, formData)
  }
  VerificarPlantilla_EmpleadoHorario(formData: any) {
    return this.http.post<any>(`${this.API_URL}/empleadoHorario/verificarPlantilla/upload`, formData)
  }
  CreaPlanificacion(formData: any, id: number, codigo: number) {
    return this.http.post<any>(`${this.API_URL}/empleadoHorario/plan_general/upload/${id}/${codigo}`, formData)
  }
  SubirArchivoExcel(formData: any, id: number, codigo: number) {
    return this.http.post<any>(`${this.API_URL}/empleadoHorario/upload/${id}/${codigo}`, formData)
  }
}
