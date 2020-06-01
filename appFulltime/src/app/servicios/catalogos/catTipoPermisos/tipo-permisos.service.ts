import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoPermisosService {

  TIPO_PERMISOS_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de TIPO PERMISOS

  getTipoPermisoRest(){
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos`);
  }

  getOneTipoPermisoRest(id:number){
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos/${id}`);
  }
  
  postTipoPermisoRest(data: any){
    return this.http.post(`${this.TIPO_PERMISOS_URL}/tipoPermisos`, data);
  }

  putTipoPermisoRest(id:number, data: any){
    return this.http.put(`${this.TIPO_PERMISOS_URL}/tipoPermisos/editar/${id}`, data);
  }
}
