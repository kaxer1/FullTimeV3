import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class VacunasService {

  constructor(
    private http: HttpClient
  ) { }

  ReporteVacunasMultiples(data: any) {
    console.log('recibiendo data', data)
    return this.http.put<any>(`${environment.url}/empleado-vacunas-multiples/vacunas-multiples/`, data);
  }

}
