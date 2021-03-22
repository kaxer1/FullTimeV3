import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PedHoraExtraService {

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  sendNotiRealTime(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  ListaAllHoraExtra() {
    return this.http.get(`${environment.url}/horas-extras-pedidas`);
  }

  ListaAllHoraExtraAutorizada() {
    return this.http.get(`${environment.url}/horas-extras-pedidas/pedidos_autorizados`);
  }

  ListaAllHoraExtraObservacion() {
    return this.http.get(`${environment.url}/horas-extras-pedidas/observaciones`);
  }

  ObtenerUnHoraExtra(id: number) {
    return this.http.get(`${environment.url}/horas-extras-pedidas/${id}`);
  }

  ObtenerListaEmpleado(id: number) {
    return this.http.get(`${environment.url}/horas-extras-pedidas/lista/${id}`);
  }

  GuardarHoraExtra(datos: any) {
    return this.http.post<any>(`${environment.url}/horas-extras-pedidas`, datos);
  }

  BuscarDatosSolicitud(id_emple_hora: number) {
    return this.http.get(`${environment.url}/horas-extras-pedidas/datosSolicitud/${id_emple_hora}`);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${environment.url}/horas-extras-pedidas/${id}/estado`, datos);
  }

  BuscarDatosAutorizacion(id_hora: number) {
    return this.http.get(`${environment.url}/horas-extras-pedidas/datosAutorizacion/${id_hora}`);
  }

  SendMailNoti(datos: any) {
    return this.http.post(`${environment.url}/horas-extras-pedidas/mail-noti`, datos);
  }

  EliminarHoraExtra(id_hora_extra: number) {
    return this.http.delete(`${environment.url}/horas-extras-pedidas/eliminar/${id_hora_extra}`);
  }

  EditarHoraExtra(id: number, datos: any) {
    return this.http.put(`${environment.url}/horas-extras-pedidas/${id}/hora-extra-solicitada`, datos);
  }

  HorarioEmpleadoSemanal(id_cargo: number) {
    return this.http.get<any>(`${environment.url}/horas-extras-pedidas/horario-empleado/${id_cargo}`);
  }

  AutorizarTiempoHoraExtra(id_hora: number, hora: any) {
    return this.http.put<any>(`${environment.url}/horas-extras-pedidas/tiempo-autorizado/${id_hora}`, hora);
  }

  EditarObservacionPedido(id: number, datos: any) {
    return this.http.put<any>(`${environment.url}/horas-extras-pedidas/observacion/${id}`, datos);
  }

  ListarPedidosHE() {
    return this.http.get(`${environment.url}/horas-extras-pedidas/listar/solicitudes`);
  }

  ListarPedidosHEAutorizadas() {
    return this.http.get(`${environment.url}/horas-extras-pedidas/solicitudes/autorizadas`);
  }

  ListarPedidosHE_Empleado(id_empleado: number) {
    return this.http.get(`${environment.url}/horas-extras-pedidas/listar/solicitudes/empleado/${id_empleado}`);
  }

  ListarPedidosHEAutorizadas_Empleado(id_empleado: number) {
    return this.http.get(`${environment.url}/horas-extras-pedidas/solicitudes/autorizadas/empleado/${id_empleado}`);
  }
}
