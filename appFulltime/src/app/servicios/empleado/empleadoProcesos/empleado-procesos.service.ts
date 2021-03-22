import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmpleadoProcesosService {

  constructor(private http: HttpClient) { }

  ObtenerListaEmpleProcesos() {
    return this.http.get(`${environment.url}/empleadoProcesos`);
  }

  RegistrarEmpleProcesos(datos: any) {
    return this.http.post(`${environment.url}/empleadoProcesos`, datos);
  }

  ObtenerProcesoPorIdCargo(id_empl_cargo: number) {
    return this.http.get<any>(`${environment.url}/empleadoProcesos/infoProceso/${id_empl_cargo}`);
  }

  ActualizarUnProceso(datos: any) {
    return this.http.put(`${environment.url}/empleadoProcesos`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${environment.url}/empleadoProcesos/eliminar/${id}`);
  }

}
