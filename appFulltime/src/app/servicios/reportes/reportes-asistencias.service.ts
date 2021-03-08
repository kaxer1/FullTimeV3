import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ReportesAsistenciasService {
  
  constructor(
    private http: HttpClient
  ) { }

  Departamentos() {
    const estado = 1; // 1 = activo 
    return this.http.get<any>(`${environment.url}/reportes-asistencias/departamentos/${estado}`);
  }

  DepartamentosByEmplDesactivados() {
    const estado = 2; // 2 = desactivo 
    return this.http.get<any>(`${environment.url}/reportes-asistencias/departamentos/${estado}`);
  }

  ReporteAtrasosMultiples(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/atrasos-empleados/${desde}/${hasta}`,data);
  }
  
  ReporteFaltasMultiples(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/faltas-empleados/${desde}/${hasta}`,data);
  }
  
  ReporteFaltasMultiplesTabulado(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/faltas-tabulado/${desde}/${hasta}`,data);
  }
  
  ReporteHorasTrabajadasMultiple(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/horas-trabaja/${desde}/${hasta}`,data);
  }
  
  ReportePuntualidadMultiple(data: any, desde: string, hasta: string, parametros: any) {
    const params = new HttpParams()
    .set('menor', parametros.menor)
    .set('intermedio', parametros.intermedio)
    .set('mayor', parametros.mayor);
    return this.http.put<any>(`${environment.url}/reportes-asistencias/puntualidad/${desde}/${hasta}`,data, {params});
  }

  ReporteTimbresMultiple(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/timbres/${desde}/${hasta}`,data);
  }

  ReporteTimbrestabulados(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/timbres-tabulados/${desde}/${hasta}`,data);
  }
  
  ReporteTabuladoTimbresIncompletos(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${environment.url}/reportes-asistencias/timbres-incompletos/${desde}/${hasta}`,data);
  }

}