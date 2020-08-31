import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  API_URL = 'http://192.168.0.192:3001';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * METODOS QUE OBTIENEN LA INFORMACION DEL KARDEX DE VACACIONES DIAS CALENDARIO.
   */
  ObtenerKardexVacacionDiasCalendarioByIdToken() {
    return this.http.get(`${this.API_URL}/reportes/vacacion`);
  }
  
  ObtenerKardexVacacionDiasCalendarioByIdEmpleado(id_empleado: number) {
    return this.http.get(`${this.API_URL}/reportes/vacacion/${id_empleado}`);
  }
  
  /**
   * Método para llamar al logotipo de la empresa, este llega codificado en base64
   * @param id_empresa ID de la empresa
   */
  LogoEmpresaImagenBase64(id_empresa: string) {
    return this.http.get<any>(`${this.API_URL}/empresas/logo/codificado/${parseInt(id_empresa)}`);
  }
  
  EditarLogoEmpresa(id_empresa: number, formData) {
    return this.http.put<any>(`${this.API_URL}/empresas/logo/${id_empresa}/uploadImage`, formData);
  }

  /**
   * Metodo para traer la informacion de datos consolidados
   * @param id_empleado id del empleado que desea obtener su asistencia
   * @param desde fecha inicia el mes o cualquier inicio de fecha
   * @param hasta fecha finaliza el mes
   */
  ReporteAsistenciaDetalleConsolidado (id_empleado: number, desde: string, hasta: string) {
    return this.http.get<any>(`${this.API_URL}/asistencia/${id_empleado}/${desde}/${hasta}`)
  }

  /**
   * Metodo para listar a los empleados con su cargo, departamento y regimen laboral
   * @param id_empresa Id de la empresa que pertenecen los empleados
   */
  ListadoEmpleadosConDepartamentoRegimen(id_empresa: number) {
    return this.http.get<any>(`${this.API_URL}/asistencia/lista-empleados/${id_empresa}`)
  }

}
