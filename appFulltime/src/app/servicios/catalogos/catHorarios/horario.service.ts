import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HorarioService {

  API_URL = 'http://localhost:3000';

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

  subirArchivoExcel(formData) {
    return this.http.post(this.API_URL + '/horario/upload', formData)  
  }

  CargarHorariosDetalles(formData) {
    return this.http.post(this.API_URL + '/horario/cargaMultiple/upload', formData)  
  }

}
