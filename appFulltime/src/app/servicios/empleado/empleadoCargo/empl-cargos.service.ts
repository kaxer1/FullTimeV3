import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmplCargosService {
  
  URL_EMPLEADO_CARGOS = 'http://192.168.0.192:3001';
  
  constructor( private http: HttpClient ) { }

  getEmpleadoCargosRest(){
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos`);
  }

  getUnCargoRest(id: number){
    return this.http.get<any>(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/${id}`);
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

  ActualizarContratoEmpleado(id: number, id_empl_contrato: number, data: any){
    return this.http.put(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/${id_empl_contrato}/${id}/actualizar/`, data);
  }

}
