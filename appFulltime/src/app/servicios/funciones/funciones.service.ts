import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  ListarFunciones() {
    return this.http.get<any>(`${this.API_URL}/administracion/funcionalidad`)
  }

  CrearFunciones(data: any) {
    return this.http.post(`${this.API_URL}/administracion`, data);
  }

  EditarFunciones(id: number, data: any) {
    return this.http.put(`${this.API_URL}/administracion/funcion/${id}`, data);
  }


}
