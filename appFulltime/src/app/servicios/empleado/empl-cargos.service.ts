import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmplCargosService {
  
  URL_EMPLEADO_CARGOS = 'http://localhost:3000';
  
  constructor( private http: HttpClient ) { }

  getEmpleadoCargosRest(){
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos`);
  }

  getUnEmpleadoCargosRest(id: number){
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/${id}`);
  }

  postEmpleadoCargosRest(data: any){
    return this.http.post(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos`, data);
  }
}
