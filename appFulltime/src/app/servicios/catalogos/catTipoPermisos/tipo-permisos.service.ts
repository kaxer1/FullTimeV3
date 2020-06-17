import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoPermisosService {

  TIPO_PERMISOS_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de TIPO PERMISOS

  getTipoPermisoRest() {
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos`);
  }

  getListAccesoTipoPermisoRest(access:number){
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos/acceso/${access}`);
  }

  getOneTipoPermisoRest(id:number){
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos/${id}`);
  }

  postTipoPermisoRest(data: any) {
    return this.http.post(`${this.TIPO_PERMISOS_URL}/tipoPermisos`, data);
  }

  putTipoPermisoRest(id: number, data: any) {
    return this.http.put(`${this.TIPO_PERMISOS_URL}/tipoPermisos/editar/${id}`, data);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.TIPO_PERMISOS_URL}/tipoPermisos/xmlDownload`, data);
  }
}
