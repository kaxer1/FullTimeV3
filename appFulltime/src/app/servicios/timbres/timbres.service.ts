import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimbresService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Metodo para traer las notificaciones de atrasos o salidas antes solo vienen 5 notificaciones
   * @param id_empleado Id del empleado loggeado
   */
  NotiTimbresRealTime(id_empleado: number) {
    return this.http.get(`${this.API_URL}/timbres/noti-timbres/${id_empleado}`);
  }

  PutVistaTimbre(id_noti_timbre: number) {
    let data = {visto:true};
    return this.http.put(`${this.API_URL}/timbres/noti-timbres/vista/${id_noti_timbre}`, data);
  }

  AvisosTimbresRealtime(id_empleado: number) {
    return this.http.get(`${this.API_URL}/timbres/noti-timbres/avisos/${id_empleado}`);
  }
  
  EliminarAvisos(Seleccionados: any[]) {
    return this.http.put<any>(`${this.API_URL}/timbres/eliminar-multiples/avisos`, Seleccionados); //Eliminacion de datos seleccionados.
  }

  PostTimbreWeb(datos: any) {
    return this.http.post<any>(`${this.API_URL}/timbres/`, datos);
  }
  
  PostTimbreWebAdmin(datos: any) {
    return this.http.post<any>(`${this.API_URL}/timbres/admin/`, datos);
  }

  ObtenerTimbres() {
    return this.http.get<any>(`${this.API_URL}/timbres/`);
  }

}
