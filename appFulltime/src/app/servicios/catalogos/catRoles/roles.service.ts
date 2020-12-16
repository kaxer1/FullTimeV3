import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  API_URI = 'http://186.71.19.82:3001';

  constructor(private http: HttpClient) { }

  // Roles

  getRoles() {
    return this.http.get<any>(`${this.API_URI}/rol`);
  }

  getOneRol(id: number) {
    return this.http.get<any>(`${this.API_URI}/rol/${id}`);
  }

  ListarRolesActualiza(id: number) {
    return this.http.get<any>(`${this.API_URI}/rol/actualiza/${id}`);
  }

  postRoles(data: any) {
    console.log(data);
    return this.http.post(`${this.API_URI}/rol`, data);
  }

  ActualizarRol(data: any) {
    return this.http.put(`${this.API_URI}/rol`, data);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URI}/rol/xmlDownload`, data);
  }

  EliminarRoles(id: number) {
    return this.http.delete(`${this.API_URI}/rol/eliminar/${id}`);
  }

}
