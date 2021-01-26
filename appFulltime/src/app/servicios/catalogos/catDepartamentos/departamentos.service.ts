import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de departamentos

  ConsultarDepartamentos() {
    return this.http.get(`${this.API_URL}/departamento`);
  }

  ConsultarDepartamentoPorContrato(id_cargo: number) {
    return this.http.get(`${this.API_URL}/departamento/busqueda-cargo/${id_cargo}`);
  }

  ConsultarNombreDepartamentos() {
    return this.http.get(`${this.API_URL}/departamento/nombreDepartamento`);
  }

  ConsultarIdNombreDepartamentos(nombreDepartamento: string) {
    return this.http.get(`${this.API_URL}/departamento/idDepartamento/${nombreDepartamento}`);
  }

  postDepartamentoRest(data: any) {
    return this.http.post(`${this.API_URL}/departamento`, data).pipe(
      catchError(data)
    );
  }

  getIdDepartamentoPadre(departamentoPadre: string) {
    return this.http.get(`${this.API_URL}/departamento/busqueda/${departamentoPadre}`);
  }

  updateDepartamento(idDepartamento: number, data: any) {
    return this.http.put(`${this.API_URL}/departamento/${idDepartamento}`, data).pipe(
      catchError(data)
    );
  }

  EncontrarUnDepartamento(id: number) {
    return this.http.get(`${this.API_URL}/departamento/${id}`);
  }

  BuscarDepartamentoSucursal(id: number) {
    return this.http.get(`${this.API_URL}/departamento/buscarDepa/${id}`);
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URL}/departamento/xmlDownload`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.API_URL}/departamento/eliminar/${id}`);
  }

  BuscarDepaSucursal(id_sucursal: number) {
    return this.http.get(`${this.API_URL}/departamento/buscar/datosDepartamento/${id_sucursal}`);
  }

  BuscarDepartamentoRegimen(id: number) {
    return this.http.get(`${this.API_URL}/departamento/buscar/regimen-departamento/${id}`);
  }

}
