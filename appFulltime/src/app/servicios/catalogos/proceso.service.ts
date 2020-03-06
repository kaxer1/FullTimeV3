import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de Procesos

  getProcesosRest(){
    console.log(this.http.get(`${this.API_URL}/proceso`));
    return this.http.get(`${this.API_URL}/proceso`);
    
  }

  getOneProcesoRest(id:number){
    return this.http.get(`${this.API_URL}/proceso/${id}`);
  }
  
  postProcesoRest(data: any){
    console.log(data);
    return this.http.post(`${this.API_URL}/proceso`, data);
  }

  getIdProcesoPadre(procesoPadre: string){
    return this.http.get(`${this.API_URL}/proceso/busqueda/${procesoPadre}`);
  }
  

}
