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

  BuscarNumPermiso(id: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/numPermiso/${id}`);
  }

  BuscarPermisoContrato(id: any) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/permisoContrato/${id}`);
  }

  SubirArchivoRespaldo(formData) {
    return this.http.post(this.API_URL + '/empleadoPermiso/upload', formData)  
  }

}
