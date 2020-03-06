import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de departamentos

  getdepartamentosRest(){
    console.log(this.http.get(`${this.API_URL}/departamento`));
    return this.http.get(`${this.API_URL}/departamento`);
    
  }

  getOnedepartamentoRest(id:number){
    return this.http.get(`${this.API_URL}/departamento/${id}`);
  }
  
  postdepartamentoRest(data: any){
    console.log(data);
    return this.http.post(`${this.API_URL}/departamento`, data);
  }

  getIddepartamentoPadre(departamentoPadre: string){
    return this.http.get(`${this.API_URL}/departamento/busqueda/${departamentoPadre}`);
  }
  
}
