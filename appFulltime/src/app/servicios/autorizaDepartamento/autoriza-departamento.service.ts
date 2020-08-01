import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AutorizaDepartamentoService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  //Empleado que autoriza en un departamento

  ConsultarAutorizaDepartamento() {
    return this.http.get(`${this.API_URL}/autorizaDepartamento`);
  }

  IngresarAutorizaDepartamento(datos: any) {
    return this.http.post(`${this.API_URL}/autorizaDepartamento`, datos);
  }

  BuscarAutoridadCargo(id: any) {
    return this.http.get(`${this.API_URL}/autorizaDepartamento/autoriza/${id}`);
  }

  BuscarEmpleadosAutorizan(id: any) {
    return this.http.get(`${this.API_URL}/autorizaDepartamento/empleadosAutorizan/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.API_URL}/autorizaDepartamento`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/autorizaDepartamento/eliminar/${id}`);
  }

}
