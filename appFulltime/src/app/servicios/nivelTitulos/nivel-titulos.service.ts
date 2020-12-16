import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NivelTitulosService {

  NIVEL_TITULO_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient
  ) { }

  // Niveles de titulos
  getOneNivelTituloRest(id: number) {
    return this.http.get<any>(`${this.NIVEL_TITULO_URL}/nivel-titulo/${id}`);
  }

  getNivelesTituloRest() {
    return this.http.get<any>(`${this.NIVEL_TITULO_URL}/nivel-titulo/`);
  }

  postNivelTituloRest(data: any) {
    console.log(data);
    return this.http.post(`${this.NIVEL_TITULO_URL}/nivel-titulo`, data);
  }

  deleteNivelTituloRest(id: number){
    return this.http.delete(`${this.NIVEL_TITULO_URL}/nivel-titulo/eliminar/${id}`);
  }

  BuscarNivelNombre(nombre: string) {
    return this.http.get<any>(`${this.NIVEL_TITULO_URL}/nivel-titulo/buscar/${nombre}`);
  }

  ActualizarNivelTitulo(datos:any){
    return this.http.put(`${this.NIVEL_TITULO_URL}/nivel-titulo`, datos);
  }

  BuscarNivelID(){
    return this.http.get<any>(`${this.NIVEL_TITULO_URL}/nivel-titulo/nivel/datos/`);
  }
}
