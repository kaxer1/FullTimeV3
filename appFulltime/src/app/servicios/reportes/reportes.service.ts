import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerTimbres(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteTimbres/listaTimbres/${empleado_id}`, data);
  }

  ObtenerPermisosHorarios(empleado_id: any) {
    return this.http.get(`${environment.url}/reporte/reportePermisos/horarios/${empleado_id}`);
  }

  ObtenerPermisosPlanificacion(empleado_id: any) {
    return this.http.get(`${environment.url}/reporte/reportePermisos/planificacion/${empleado_id}`);
  }

  ObtenerAutorizacionPermiso(empleado_id: any) {
    return this.http.get(`${environment.url}/reporte/reportePermisos/autorizaciones/${empleado_id}`);
  }

  ObtenerTimbresAtrasosHorario(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteAtrasos/horarios/${empleado_id}`, data);
  }

  ObtenerTimbresAtrasosPlanificacion(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteAtrasos/planificacion/${empleado_id}`, data);
  }

  ObtenerEntradaSalidaHorario(codigo: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteEntradaSalida/horarios/${codigo}`, data);
  }

  ObtenerEntradaSalidaPlanificacion(codigo: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteEntradaSalida/planificacion/${codigo}`, data);
  }

  ObtenerPermisosHorariosFechas(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reportePermisos/fechas/horarios/${empleado_id}`, data);
  }

  ObtenerPermisosPlanificacionFechas(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reportePermisos/fechas/planificacion/${empleado_id}`, data);
  }
}
