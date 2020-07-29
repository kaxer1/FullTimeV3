import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmpleadoHorariosService {

  API_URL = 'http://localhost:3000';

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

  SubirArchivoExcel(formData, id) {
    return this.http.post(`${this.API_URL}/empleadoHorario/upload/${id}`, formData)
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

}
