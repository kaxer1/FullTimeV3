import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DatosGeneralesService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  AutorizaEmpleado(id_empleado: number) {
    return this.http.get(`${this.API_URL}/generalidades/empleadoAutoriza/${id_empleado}`);
  }

  ListarInformacionActual() {
    return this.http.get(`${this.API_URL}/generalidades/info_actual`);
  }

}
