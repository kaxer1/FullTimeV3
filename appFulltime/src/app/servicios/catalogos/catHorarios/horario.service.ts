import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HorarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getHorariosRest() {
    return this.http.get(`${this.API_URL}/horario`);
  }

  getOneHorarioRest(id: number) {
    return this.http.get(`${this.API_URL}/horario/${id}`);
  }

  postHorarioRest(data: any) {
    return this.http.post(`${this.API_URL}/horario`, data);
  }

  putHorarioRest(id: number, data: any) {
    return this.http.put(`${this.API_URL}/horario/editar/${id}`, data);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/horario/xmlDownload`, data);
  }

  SubirArchivoRespaldo(formData, id: number) {
    return this.http.put(`${this.API_URL}/horario/${id}/documento`, formData)
  }

  EditarDocumento(id: number, data: any) {
    return this.http.put(`${this.API_URL}/horario/editar/editarDocumento/${id}`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/horario/eliminar/${id}`);
  }

  VerificarDuplicados(nombre: string) {
    return this.http.get(`${this.API_URL}/horario/verificarDuplicados/${nombre}`);
  }

  VerificarDuplicadosEdicion(id: number, nombre: string) {
    return this.http.get(`${this.API_URL}/horario/verificarDuplicados/edicion/${id}/${nombre}`);
  }

  // Verificar datos de la plantilla de catálogo horario y cargar al sistema
  VerificarDatosHorario(formData) {
    return this.http.post<any>(`${this.API_URL}/horario/cargarHorario/verificarDatos/upload`, formData);
  }
  VerificarPlantillaHorario(formData) {
    return this.http.post<any>(`${this.API_URL}/horario/cargarHorario/verificarPlantilla/upload`, formData);
  }
  CargarHorariosMultiples(formData) {
    return this.http.post<any>(`${this.API_URL}/horario/cargarHorario/upload`, formData);
  }

}
