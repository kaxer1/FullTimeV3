import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de usuarios

  getUsuariosRest() {
    return this.http.get(`${this.API_URL}/usuarios`);
  }

  BuscarUsersNoEnrolados() {
    return this.http.get(`${this.API_URL}/usuarios/noEnrolados`);
  }

  getIdByUsuarioRest(usuario: string) {
    return this.http.get(`${this.API_URL}/usuarios/busqueda/${usuario}`);
  }

  postUsuarioRest(data: any) {
    return this.http.post(`${this.API_URL}/usuarios`, data)
      .pipe(
        catchError(data)
      );
  }

  BuscarDatosUser(id: number) {
    return this.http.get(`${this.API_URL}/usuarios/datos/${id}`);
  }

  ActualizarPassword(data: any) {
    return this.http.put(`${this.API_URL}/usuarios`, data);
  }

  ActualizarDatos(data: any) {
    return this.http.put(`${this.API_URL}/usuarios/actualizarDatos`, data).pipe(
      catchError(data));
  }

  crearAccesosSistema(data: any) {
    return this.http.post(`${this.API_URL}/usuarios/acceso`, data);
  }

  ActualizarFrase(data: any) {
    return this.http.put(`${this.API_URL}/usuarios/frase`, data);
  }

  /** ADMINISTRACIÓN MÓDULO DE ALIMENTACIÓN */
  RegistrarAdminComida(data: any) {
    return this.http.put(`${this.API_URL}/usuarios/admin/comida`, data);
  }

}
