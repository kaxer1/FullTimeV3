import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorasExtrasService {
  HORA_EXTRA_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  // catalogo de horas extras

  postHoraExtraRest(data: any){
      return this.http.post(`${this.HORA_EXTRA_URL}/horasExtras`, data);
  }
}
