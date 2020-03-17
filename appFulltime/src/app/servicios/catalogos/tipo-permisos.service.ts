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
    console.log(this.http.get(`${this.TIPO_PERMISOS_URL}/`));
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos`);
  }

  getOneTipoPermisoRest(id:number){
    return this.http.get(`${this.TIPO_PERMISOS_URL}/tipoPermisos/${id}`);
  }
  
  postTipoPermisoRest(data: any){
    console.log(data);
    return this.http.post(`${this.TIPO_PERMISOS_URL}/tipoPermisos`, data);
  }
}
