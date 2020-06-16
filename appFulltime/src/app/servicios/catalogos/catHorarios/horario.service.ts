import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HorarioService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getHorariosRest(){
    return this.http.get(`${this.API_URL}/horario`);
  }

  getOneHorarioRest(id:number){
    return this.http.get(`${this.API_URL}/horario/${id}`);
  }
  
  postHorarioRest(data: any){
    return this.http.post(`${this.API_URL}/horario`, data);
  } 

  putHorarioRest(id:number, data: any){
    return this.http.put(`${this.API_URL}/horario/editar/${id}`, data);
  }

  subirArchivoExcel(formData) {
    return this.http.post(this.API_URL + '/horario/upload', formData)  
  }

  CargarHorariosDetalles(formData) {
    return this.http.post(this.API_URL + '/horario/cargaMultiple/upload', formData)  
  }

}
