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

}
