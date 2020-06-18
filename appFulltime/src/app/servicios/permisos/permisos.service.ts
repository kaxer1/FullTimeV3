import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  // realtime
  getDocument(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  // Permisos Empleado

  obtenerAllPermisos() {
    return this.http.get(`${this.API_URL}/empleadoPermiso/lista`);
  }
  
  obtenerUnPermisoEmleado(id_permiso: number) {
    return this.http.get(`${this.API_URL}/empleadoPermiso/un-permiso/${id_permiso}`);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/empleadoPermiso/${id}/estado`, datos);
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


}
