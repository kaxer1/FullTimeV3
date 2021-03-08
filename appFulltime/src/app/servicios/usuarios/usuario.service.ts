import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de usuarios

  getUsuariosRest() {
    return this.http.get(`${environment.url}/usuarios`);
  }

  BuscarUsersNoEnrolados() {
    return this.http.get(`${environment.url}/usuarios/noEnrolados`);
  }

  getIdByUsuarioRest(usuario: string) {
    return this.http.get(`${environment.url}/usuarios/busqueda/${usuario}`);
  }

  postUsuarioRest(data: any) {
    return this.http.post(`${environment.url}/usuarios`, data)
      .pipe(
        catchError(data)
      );
  }

  BuscarDatosUser(id: number) {
    return this.http.get(`${environment.url}/usuarios/datos/${id}`);
  }

  ActualizarPassword(data: any) {
    return this.http.put(`${environment.url}/usuarios`, data);
  }

  ActualizarDatos(data: any) {
    return this.http.put(`${environment.url}/usuarios/actualizarDatos`, data).pipe(
      catchError(data));
  }

  crearAccesosSistema(data: any) {
    return this.http.post(`${environment.url}/usuarios/acceso`, data);
  }

  ActualizarFrase(data: any) {
    return this.http.put(`${environment.url}/usuarios/frase`, data);
  }

}
