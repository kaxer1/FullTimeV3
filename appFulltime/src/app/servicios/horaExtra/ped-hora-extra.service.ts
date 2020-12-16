import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedHoraExtraService {

  API_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  sendNotiRealTime(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  ListaAllHoraExtra() {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas`);
  }

  ListaAllHoraExtraAutorizada() {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/pedidos_autorizados`);
  }

  ListaAllHoraExtraObservacion() {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/observaciones`);
  }

  ObtenerUnHoraExtra(id: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/${id}`);
  }

  ObtenerListaEmpleado(id: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/lista/${id}`);
  }

  GuardarHoraExtra(datos: any) {
    return this.http.post<any>(`${this.API_URL}/horas-extras-pedidas`, datos);
  }

  BuscarDatosSolicitud(id_emple_hora: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/datosSolicitud/${id_emple_hora}`);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/horas-extras-pedidas/${id}/estado`, datos);
  }

  BuscarDatosAutorizacion(id_hora: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/datosAutorizacion/${id_hora}`);
  }

  SendMailNoti(datos: any) {
    return this.http.post(`${this.API_URL}/horas-extras-pedidas/mail-noti`, datos);
  }

  EliminarHoraExtra(id_hora_extra: number) {
    return this.http.delete(`${this.API_URL}/horas-extras-pedidas/eliminar/${id_hora_extra}`);
  }

  EditarHoraExtra(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/horas-extras-pedidas/${id}/hora-extra-solicitada`, datos);
  }

  HorarioEmpleadoSemanal(id_cargo: number) {
    return this.http.get<any>(`${this.API_URL}/horas-extras-pedidas/horario-empleado/${id_cargo}`);
  }

  AutorizarTiempoHoraExtra(id_hora: number, hora: any) {
    return this.http.put<any>(`${this.API_URL}/horas-extras-pedidas/tiempo-autorizado/${id_hora}`, hora);
  }

  EditarObservacionPedido(id: number, datos: any) {
    return this.http.put<any>(`${this.API_URL}/horas-extras-pedidas/observacion/${id}`, datos);
  }

  ListarPedidosHE() {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/listar/solicitudes`);
  }

  ListarPedidosHEAutorizadas() {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/solicitudes/autorizadas`);
  }

  ListarPedidosHE_Empleado(id_empleado: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/listar/solicitudes/empleado/${id_empleado}`);
  }

  ListarPedidosHEAutorizadas_Empleado(id_empleado: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/solicitudes/autorizadas/empleado/${id_empleado}`);
  }
}
