import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NivelTitulosService {

  NIVEL_TITULO_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

   // Niveles de titulos
   getOneNivelTituloRest(id: number){
    return this.http.get<any>(`${this.NIVEL_TITULO_URL}/nivel-titulo/${id}`);
  }

  getNivelesTituloRest(){
    return this.http.get<any>(`${this.NIVEL_TITULO_URL}/nivel-titulo/`);
  }

  postNivelTituloRest(data: any){
    console.log(data); 
    return this.http.post(`${this.NIVEL_TITULO_URL}/nivel-titulo`, data);
  }
}
