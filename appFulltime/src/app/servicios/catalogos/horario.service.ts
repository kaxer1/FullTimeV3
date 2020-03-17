import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de Horarios

  getHorariosRest(){
    return this.http.get(`${this.API_URL}/horario`);
  }

  getOneHorarioRest(id:number){
    return this.http.get(`${this.API_URL}/horario/${id}`);
  }
  
  postHorarioRest(data: any){
    console.log(data);
    return this.http.post(`${this.API_URL}/horario`, data);
  }

 
  

}
