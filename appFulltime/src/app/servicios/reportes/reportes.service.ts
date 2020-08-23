import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  API_URL = 'http://localhost:3000';

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

}
