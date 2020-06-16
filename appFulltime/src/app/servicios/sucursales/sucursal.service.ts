import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getSucursalesRest() {
    return this.http.get(`${this.API_URL}/sucursales`);
  }

  EncontrarUltimoId() {
    return this.http.get(`${this.API_URL}/sucursales/ultimoId`);
  }

  getOneSucursalRest(id: number) {
    return this.http.get(`${this.API_URL}/sucursales/unaSucursal/${id}`);
  }

  postSucursalRest(data: any) {
    return this.http.post(`${this.API_URL}/sucursales`, data);
  }

  BuscarSucEmpresa(id_empresa: number) {
    return this.http.get(`${this.API_URL}/sucursales/buscar/nombreSuc/${id_empresa}`);
  }

  ActualizarSucursal(datos: any) {
    return this.http.put(`${this.API_URL}/sucursales`, datos);
  }


}
