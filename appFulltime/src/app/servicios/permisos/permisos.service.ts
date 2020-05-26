import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Permisos Empleado

  ConsultarEmpleadoPermisos() {
    return this.http.get(`${this.API_URL}/empleadoPermiso`);
  }

  IngresarEmpleadoPermisos(datos: any) {
    return this.http.post(`${this.API_URL}/empleadoPermiso`, datos);
  }

  SubirArchivoRespaldo(formData, id: number) {
    return this.http.post(`${this.API_URL}/empleadoPermiso/${id}/documento`, formData)  
  }


}
