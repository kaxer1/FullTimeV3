import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmpresaService {

  API_URL = 'http://192.168.0.192:3001';

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

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/empresas/xmlDownload`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/empresas/eliminar/${id}`);
  }

  ConsultarDatosEmpresa(id: number) {
    return this.http.get(`${this.API_URL}/empresas/buscar/datos/${id}`);
  }

}
