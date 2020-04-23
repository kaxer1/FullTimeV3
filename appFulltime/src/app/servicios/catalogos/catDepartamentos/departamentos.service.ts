import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // catalogo de departamentos

  ConsultarDepartamentos(){
    return this.http.get(`${this.API_URL}/departamento`);
  }

  ConsultarNombreDepartamentos(){
    return this.http.get(`${this.API_URL}/departamento/nombreDepartamento`);
  }

  ConsultarIdNombreDepartamentos(nombreDepartamento: string){
    return this.http.get(`${this.API_URL}/departamento/idDepartamento/${nombreDepartamento}`);
  }

  postDepartamentoRest(data: any){ 
    return this.http.post(`${this.API_URL}/departamento`, data);
  }

  getIdDepartamentoPadre(departamentoPadre: string){
    return this.http.get(`${this.API_URL}/departamento/busqueda/${departamentoPadre}`);
  }

  updateDepartamento(idDepartamento: number, data:any){
    return this.http.put(`${this.API_URL}/departamento/${idDepartamento}`, data)
  }

  getOneDepartamentoRest(id:number){
    return this.http.get(`${this.API_URL}/departamento/${id}`);
  }

  BuscarDepartamentoSucursal(id:number){
    return this.http.get(`${this.API_URL}/departamento/buscarDepa/${id}`);
  }

}
