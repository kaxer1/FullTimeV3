import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmplCargosService {

  URL_EMPLEADO_CARGOS = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getEmpleadoCargosRest() {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos`);
  }

  getListaEmpleadoCargosRest() {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/lista-empleados`);
  }

  getUnCargoRest(id: number) {
    return this.http.get<any>(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/${id}`);
  }

  getInfoCargoEmpleadoRest(id_empl_contrato: number) {
    return this.http.get<any>(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/cargoInfo/${id_empl_contrato}`);
  }

  postEmpleadoCargosRest(data: any) {
    return this.http.post(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos`, data);
  }

  BuscarIDCargo(id: number) {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/buscar/${id}`);
  }

  BuscarIDCargoActual(id: number) {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/buscar/cargoActual/${id}`);
  }

  ActualizarContratoEmpleado(id: number, id_empl_contrato: number, data: any) {
    return this.http.put(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/${id_empl_contrato}/${id}/actualizar/`, data);
  }

  ListarEmpleadosAutorizacion(id: number) {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/empleadosAutorizan/${id}`);
  }

  // SERVICIOS TIPO CARGO
  ObtenerTipoCargos() {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/listar/tiposCargo`);
  }

  CrearTipoCargo(data: any) {
    return this.http.post(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/tipo_cargo`, data);
  }

  ObtenerUltimoTipoCargos() {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/buscar/ultimoTipo/cargo`);
  }

  ObtenerUnTipoCargo(id: number) {
    return this.http.get(`${this.URL_EMPLEADO_CARGOS}/empleadoCargos/buscar/ultimoTipo/nombreCargo/${id}`);
  }

}
