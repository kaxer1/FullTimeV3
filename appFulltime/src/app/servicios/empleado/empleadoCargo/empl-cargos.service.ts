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

  getInfoCargoEmpleadoRest(id_empl_contrato: number){
    return this.http.get<any>(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/cargoInfo/${id_empl_contrato}`);
  }

  postEmpleadoCargosRest(data: any){
    return this.http.post(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos`, data);
  }

  BuscarIDCargo(id: number){
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/buscar/${id}`);
  }

  BuscarIDCargoActual(id: number){
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/buscar/cargoActual/${id}`);
  }

}
