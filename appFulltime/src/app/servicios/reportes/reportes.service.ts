import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerTimbres(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reporteTimbres/listaTimbres/${empleado_id}`, data);
  }

  ObtenerPermisosHorarios(empleado_id: any) {
    return this.http.get(`${this.API_URL}/reporte/reportePermisos/horarios/${empleado_id}`);
  }

  ObtenerPermisosPlanificacion(empleado_id: any) {
    return this.http.get(`${this.API_URL}/reporte/reportePermisos/planificacion/${empleado_id}`);
  }

  ObtenerAutorizacionPermiso(empleado_id: any) {
    return this.http.get(`${this.API_URL}/reporte/reportePermisos/autorizaciones/${empleado_id}`);
  }

  ObtenerTimbresAtrasosHorario(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reporteAtrasos/horarios/${empleado_id}`, data);
  }

  ObtenerTimbresAtrasosPlanificacion(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reporteAtrasos/planificacion/${empleado_id}`, data);
  }

  ObtenerEntradaSalidaHorario(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reporteEntradaSalida/horarios/${empleado_id}`, data);
  }

  ObtenerEntradaSalidaPlanificacion(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reporteEntradaSalida/planificacion/${empleado_id}`, data);
  }

  ObtenerPermisosHorariosFechas(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reportePermisos/fechas/horarios/${empleado_id}`, data);
  }

  ObtenerPermisosPlanificacionFechas(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/reportePermisos/fechas/planificacion/${empleado_id}`, data);
  }
}
