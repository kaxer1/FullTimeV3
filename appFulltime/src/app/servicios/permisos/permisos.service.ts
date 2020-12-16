import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  API_URL = 'http://186.71.19.82:3001';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  sendNotiRealTime(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  // Permisos Empleado

  obtenerAllPermisos() {
    return this.http.get(`${this.API_URL}/empleadoPermiso/lista`);
  }

  BuscarPermisosAutorizados() {
    return this.http.get(`${this.API_URL}/empleadoPermiso/lista-autorizados`);
  }

  obtenerUnPermisoEmleado(id_permiso: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/un-permiso/${id_permiso}`);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/empleadoPermiso/${id}/estado`, datos);
  }

  EditarPermiso(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/empleadoPermiso/${id}/permiso-solicitado`, datos);
  }

  ConsultarEmpleadoPermisos() {
    return this.http.get(`${this.API_URL}/empleadoPermiso`);
  }

  IngresarEmpleadoPermisos(datos: any) {
    return this.http.post(`${this.API_URL}/empleadoPermiso`, datos);
  }

  ObtenerUnPermiso(id: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/${id}`)
  }

  SubirArchivoRespaldo(formData, id: number) {
    return this.http.put(`${this.API_URL}/empleadoPermiso/${id}/documento`, formData)
  }

  BuscarNumPermiso(id: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/numPermiso/${id}`);
  }

  BuscarPermisoContrato(id: any) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/permisoContrato/${id}`);
  }

  BuscarDatosSolicitud(id_emple_permiso: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/datosSolicitud/${id_emple_permiso}`);
  }

  BuscarDatosAutorizacion(id_permiso: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/datosAutorizacion/${id_permiso}`);
  }

  EliminarPermiso(id_permiso: number, doc: string) {
    return this.http.delete(`${this.API_URL}/empleadoPermiso/eliminar/${id_permiso}/${doc}`);
  }

  SendMailNoti(datos: any) {
    return this.http.post(`${this.API_URL}/empleadoPermiso/mail-noti`, datos);
  }

  BuscarPermisoCodigo(codigo: any) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/permisoCodigo/${codigo}`);
  }

  BuscarFechasPermiso(datos: any, codigo: number) {
    return this.http.post(`${this.API_URL}/empleadoPermiso/fechas_permiso/${codigo}`, datos);
  }
}
