import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  API_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getSucursalesRest() {
    return this.http.get(`${this.API_URL}/sucursales`);
  }

  VerSucursalesRegistro() {
    return this.http.get(`${this.API_URL}/sucursales/registro`);
  }

  VerSucursalActualizar(id: number) {
    return this.http.get(`${this.API_URL}/sucursales/actualizar/${id}`);
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

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/sucursales/xmlDownload`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/sucursales/eliminar/${id}`);
  }

}
