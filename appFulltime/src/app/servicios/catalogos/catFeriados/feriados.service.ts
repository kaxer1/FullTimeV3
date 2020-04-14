import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeriadosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo feriado
  CrearNuevoFeriado(datos: any) {
    return this.http.post(`${this.API_URL}/feriados`, datos);
  }

  ConsultarFeriado(){
    return this.http.get(`${this.API_URL}/feriados`);
  }

  ConsultarUnFeriado(id: number){
    return this.http.get(`${this.API_URL}/feriados/${id}`);
  }

  ActualizarUnFeriado(datos:any){
    return this.http.put(`${this.API_URL}/feriados`, datos);
  }

  ConsultarUltimoId(){
    return this.http.get(`${this.API_URL}/feriados/ultimoId`);
  }

  subirArchivoExcel(formData) {
    return this.http.post(this.API_URL + '/feriados/upload', formData)  
  }

}
