import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiscapacidadService {
  Discapacidad_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,

  ) { }

  // Catalogo de discapacidad
  postDiscapacidadRest(data: any){
    return this.http.post(`${this.Discapacidad_URL}/discapacidad`, data);
  }

  getDiscapacidadUsuarioRest(id: number){
    return this.http.get(`${this.Discapacidad_URL}/discapacidad/${id}`);
  }

  putDiscapacidadUsuarioRest(id: number, data: any){
    return this.http.put(`${this.Discapacidad_URL}/discapacidad/${id}`, data);
  }

  deleteDiscapacidadUsuarioRest(id: number){
    return this.http.delete(`${this.Discapacidad_URL}/discapacidad/eliminar/${id}`);
  }

}
