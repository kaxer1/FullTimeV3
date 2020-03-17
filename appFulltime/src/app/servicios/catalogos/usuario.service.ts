import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de usuarios

  getUsuariosRest(){
    return this.http.get(`${this.API_URL}/usuarios`);
  }

  getIdByUsuarioRest(usuario:string){
    return this.http.get(`${this.API_URL}/usuarios/busqueda/${usuario}`);
  }
  
}
