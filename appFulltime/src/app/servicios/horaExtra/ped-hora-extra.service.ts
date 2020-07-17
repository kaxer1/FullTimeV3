import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedHoraExtraService {

  API_URL = 'http://localhost:3000';

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

  ObtenerUnHoraExtra(id: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/${id}`);
  }
  
  ObtenerListaEmpleado(id: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/lista/${id}`);
  }

  GuardarHoraExtra(datos: any) {
    return this.http.post(`${this.API_URL}/horas-extras-pedidas`, datos);
  }

  BuscarDatosSolicitud(id_emple_hora: number) {
    return this.http.get(`${this.API_URL}/horas-extras-pedidas/datosSolicitud/${id_emple_hora}`);
  }

}
