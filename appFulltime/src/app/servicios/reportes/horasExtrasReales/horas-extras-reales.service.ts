import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HorasExtrasRealesService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerDatosContratoA() {
    return this.http.get(`${this.API_URL}/reporte/horasExtrasReales`);
  }

  ObtenerDatosCargoA(empleado_id: any) {
    return this.http.get(`${this.API_URL}/reporte/horasExtrasReales/${empleado_id}`).pipe(
      catchError(empleado_id)
    );
  }

  ObtenerEntradaSalida(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/horasExtrasReales/entradaSalida/${empleado_id}`, data)
  }

  ObtenerPedidos(empleado_id: any, data: any) {
    return this.http.post(`${this.API_URL}/reporte/horasExtrasReales/listaPedidos/${empleado_id}`, data)
  }

  ObtenerEntradaSalidaTodos(data: any) {
    return this.http.post(`${this.API_URL}/reporte/horasExtrasReales/entradaSalida/total/timbres`, data)
  }

  ObtenerPedidosTodos(data: any) {
    return this.http.post(`${this.API_URL}/reporte/horasExtrasReales/listaPedidos/total/solicitudes`, data)
  }

  ObtenerTimbres(empleado_id: any) {
    return this.http.get(`${this.API_URL}/reporte/horasExtrasReales/listaTimbres/${empleado_id}`)
  }

}
