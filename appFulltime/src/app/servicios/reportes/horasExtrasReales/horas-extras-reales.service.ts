import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorasExtrasRealesService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerDatosContratoA() {
    return this.http.get(`${this.API_URL}/reporte/horasExtrasReales`);
  }

  ObtenerDatosCargoA(empleado_id: number) {
    return this.http.get(`${this.API_URL}/reporte/horasExtrasReales/${empleado_id}`);
  }

}
