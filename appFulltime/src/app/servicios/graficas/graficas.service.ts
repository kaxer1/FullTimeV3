import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  
  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * METODOS MACRO PARA LAS GRAFICAS
   * @param desde FECHA INICIO DE REFERENCIA
   * @param hasta FECHA FINAL DE REFERENCIA
   */

  MetricaHoraExtraMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/hora-extra/macro/${desde}/${hasta}`);
  }

  MetricaRetrasoMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/retrasos/macro/${desde}/${hasta}`);
  }

  MetricaAsistenciaMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/asistencia/macro/${desde}/${hasta}`);
  }

  MetricaJornadaHoraExtraMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/jornada-vs-hora-extra/macro/${desde}/${hasta}`);
  }

  MetricaTiempoJornadaHoraExtraMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/tiempo-jornada-vs-hora-ext/macro/${desde}/${hasta}`);
  }
  
  MetricaInasistenciaMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/inasistencia/macro/${desde}/${hasta}`);
  }
  
  MetricaMarcacionesMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/marcaciones-emp/macro/${desde}/${hasta}`);
  }
  
  MetricaSalidasAntesMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/salidas-anticipadas/macro/${desde}/${hasta}`);
  }

  /**
   * METODOS MICRO PARA LAS GRAFICAS DEL HOME
   */
  MetricaHoraExtraMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/hora-extra/micro`);
  }

  MetricaRetrasoMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/retrasos/micro`);
  }

  MetricaAsistenciaMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/asistencia/micro`);
  }

  MetricaJornadaHoraExtraMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/jornada-vs-hora-extra/micro`);
  }

  MetricaTiempoJornadaHoraExtraMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/tiempo-jornada-vs-hora-ext/micro`);
  }
  
  MetricaInasistenciaMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/inasistencia/micro`);
  }
  
  MetricaMarcacionesMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/marcaciones-emp/micro`);
  }
  
  MetricaSalidasAntesMicro() {
    return this.http.get<any>(`${this.API_URL}/metricas/admin/salidas-anticipadas/micro`);
  }


  /**
   * MÉTODOS DE GRÁFICOS PARA EMPLEADO
   */ 
  EmpleadoHoraExtra() {
    return this.http.get<any>(`${this.API_URL}/metricas/user/hora-extra/micro`);  
  }
  
  EmpleadoPermisos() {
    return this.http.get<any>(`${this.API_URL}/metricas/user/permisos/micro`);  
  }
  
  EmpleadoVacaciones() {
    return this.http.get<any>(`${this.API_URL}/metricas/user/vacaciones/micro`);  
  }
  
  EmpleadoAtrasos() {
    return this.http.get<any>(`${this.API_URL}/metricas/user/atrasos/micro`);  
  }
  
  /**
   *  METODOS PARA GRAFICAS DE EMPLEADOS MACRO
   */

  EmpleadoHoraExtraMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/user/hora-extra/macro/${desde}/${hasta}`);  
  }
  
  EmpleadoPermisosMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/user/permisos/macro/${desde}/${hasta}`);  
  }
  
  EmpleadoVacacionesMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/user/vacaciones/macro/${desde}/${hasta}`);  
  }
  
  EmpleadoAtrasosMacro(desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/metricas/user/atrasos/macro/${desde}/${hasta}`);  
  }
}
