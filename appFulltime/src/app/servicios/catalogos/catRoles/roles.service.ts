import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  API_URI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Roles

  getRoles() {
    return this.http.get<any>(`${this.API_URI}/rol`);
  }

  getOneRol(id: number) {
    return this.http.get<any>(`${this.API_URI}/rol/${id}`);
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

}
