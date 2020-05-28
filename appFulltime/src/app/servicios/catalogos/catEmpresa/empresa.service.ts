import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmpresaService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  //Empresas

  ConsultarEmpresas() {
    return this.http.get(`${this.API_URL}/empresas`);
  }

  IngresarEmpresas(datos: any) {
    return this.http.post(`${this.API_URL}/empresas`, datos);
  }

  ActualizarEmpresa(datos: any) {
    return this.http.put(`${this.API_URL}/empresas`, datos);
  }

  ConsultarUnaEmpresa(nombre: string) {
    return this.http.get(`${this.API_URL}/empresas/buscar/${nombre}`);
  }

}
