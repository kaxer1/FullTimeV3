import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccionPersonalService {

  constructor(
    private http: HttpClient,
  ) { }

  /** SERVICIOS PARA TABLA TIPO_ACCION_PERSONAL */
  ConsultarTipoAccionPersonal() {
    return this.http.get(`${environment.url}/accionPersonal`);
  }

  IngresarTipoAccionPersonal(datos: any) {
    return this.http.post(`${environment.url}/accionPersonal`, datos);
  }

  BuscarTipoAccionPersonalId(id: any) {
    return this.http.get(`${environment.url}/accionPersonal/tipo/accion/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${environment.url}/accionPersonal`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${environment.url}/accionPersonal/eliminar/${id}`);
  }

  /** SERVICIOS PARA TABLA PROCESO_PROPUESTO*/
  ConsultarProcesoPropuesto() {
    return this.http.get(`${environment.url}/accionPersonal/proceso`);
  }

  IngresarProcesoPropuesto(datos: any) {
    return this.http.post(`${environment.url}/accionPersonal/proceso`, datos);
  }

  BuscarIdProcesoPropuesto() {
    return this.http.get(`${environment.url}/accionPersonal/tipo/proceso`);
  }

  /** SERVICIOS PARA TABLA CARGO_PROPUESTO*/
  ConsultarCargoPropuesto() {
    return this.http.get(`${environment.url}/accionPersonal/cargo`);
  }

  IngresarCargoPropuesto(datos: any) {
    return this.http.post(`${environment.url}/accionPersonal/cargo`, datos);
  }

  BuscarIdCargoPropuesto() {
    return this.http.get(`${environment.url}/accionPersonal/tipo/cargo`);
  }

  /** SERVICIOS PARA TABLA DECRETO_ACUERDO_RESOLUCION*/
  ConsultarDecreto() {
    return this.http.get(`${environment.url}/accionPersonal/decreto`);
  }

  IngresarDecreto(datos: any) {
    return this.http.post(`${environment.url}/accionPersonal/decreto`, datos);
  }

  BuscarIdDecreto() {
    return this.http.get(`${environment.url}/accionPersonal/tipo/decreto`);
  }

  /** SERVICIOS PARA TABLA PEDIDO_ACCION_EMPLEADO */
  IngresarPedidoAccion(datos: any) {
    return this.http.post(`${environment.url}/accionPersonal/pedido/accion`, datos);
  }

  LogoImagenBase64() {
    return this.http.get<any>(`${environment.url}/accionPersonal/logo/ministerio/codificado`);
  }

  /** CONSULTA DE DATOS DE PEDIDOS DE ACCION DE PERSONAL */
  BuscarDatosPedido() {
    return this.http.get(`${environment.url}/accionPersonal/pedidos/accion`);
  }

  BuscarDatosPedidoEmpleados(id: any) {
    return this.http.get(`${environment.url}/accionPersonal/pedidos/datos/${id}`);
  }

  BuscarDatosPedidoId(id: any) {
    return this.http.get(`${environment.url}/accionPersonal/pedido/informacion/${id}`);
  }

  Buscarprocesos(id: any) {
    return this.http.get(`${environment.url}/accionPersonal/lista/procesos/${id}`);
  }
}
