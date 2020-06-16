import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoProcesosService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(private http: HttpClient) { }

  ObtenerListaEmpleProcesos() {
    return this.http.get(`${this.API_URL}/empleadoProcesos`);
  }

  RegistrarEmpleProcesos(datos: any) {
    return this.http.post(`${this.API_URL}/empleadoProcesos`, datos);
  }

  ObtenerProcesoPorIdCargo(id_empl_cargo: number) {
    return this.http.get<any>(`${this.API_URL}/empleadoProcesos/infoProceso/${id_empl_cargo}`);
  }

  ActualizarUnProceso(datos: any) {
    return this.http.put(`${this.API_URL}/empleadoProcesos`, datos);
  }

}
