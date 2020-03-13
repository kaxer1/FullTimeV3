import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnroladoService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de enrolados

  getEnroladosRest(){
    return this.http.get(`${this.API_URL}/enrolados`);
  }

  getOneEnroladosRest(id:number){
    return this.http.get(`${this.API_URL}/enrolados/${id}`);
  }
  
  postEnroladosRest(data: any){
    console.log(data)
    return this.http.post(`${this.API_URL}/enrolados`, data);
  }

}