import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MultiplePlanHorarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  CargarArchivoExcel(formData) {
    return this.http.post(`${this.API_URL}/cargaMultiple/upload`, formData)
  }
  CargarHorarioFijoVarios(formData) {
    return this.http.post(`${this.API_URL}/cargaMultiple/horarioFijo/upload`, formData)
  }
}
