import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimbresService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Metodo para traer las notificaciones de atrasos o salidas antes
   * @param id_empleado Id del empleado loggeado
   */
  NotiTimbresRealTime(id_empleado: number) {
    return this.http.get(`${this.API_URL}/timbres/noti-timbres/${id_empleado}`);
  }

  PutVistaTimbre(id_noti_timbre: number) {
    let data = {visto:true};
    return this.http.put(`${this.API_URL}/timbres/noti-timbres/vista/${id_noti_timbre}`, data);
  }

}
