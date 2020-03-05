import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegimenService {

  TITULO_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // Invocación del método post para crear nuevo régimen laboral
  CrearNuevoRegimen(data: any) {
    return this.http.post(`${this.TITULO_URL}/regimenLaboral`, data);
  }
}
