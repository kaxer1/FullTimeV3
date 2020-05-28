import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { saveAs } from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  API_URI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
  
  // Empleados  
  getEmpleadosRest(){
    return this.http.get(`${this.API_URI}/empleado`);
  }
  
  getOneEmpleadoRest(id: number){
    return this.http.get<any>(`${this.API_URI}/empleado/${id}`);
  }

  postEmpleadoRest(data: any){
    return this.http.post(`${this.API_URI}/empleado`, data);
  }
  
  putEmpleadoRest(data: any, id: number){
    return this.http.put(`${this.API_URI}/empleado/${id}/usuario`, data);
  }
  
  subirArchivoExcel(formData) {
    return this.http.post(`${this.API_URI}/empleado/plantillaExcel/`, formData);
  }

  // Servicio para insertar el empleado con sus respectivos titulos
  postEmpleadoTitulos(data: any){
    return this.http.post(`${this.API_URI}/empleado/emplTitulos`, data);
  }

  getEmpleadoTituloRest(id: number){
    return this.http.get(`${this.API_URI}/empleado/emplTitulos/${id}`);
  }

  putEmpleadoTituloRest(id: number, data: any){
    return this.http.put(`${this.API_URI}/empleado/${id}/titulo`, data);
  }

  deleteEmpleadoTituloRest(id: number){
    return this.http.delete(`${this.API_URI}/empleado/eliminar/titulo/${id}`);
  }

  // Servicio para insertar contrato del empleado
  CrearContratoEmpleado(datos: any){
    return this.http.post(`${this.API_URI}/contratoEmpleado`, datos);
  }

  ObtenerUnContrato(id: number) {
    return this.http.get(`${this.API_URI}/contratoEmpleado/${id}/get`);
  }

  ActualizarContratoEmpleado(id: number, id_empleado: number, data: any){
    return this.http.put(`${this.API_URI}/contratoEmpleado/${id_empleado}/${id}/actualizar/`, data);
  }

  BuscarIDContrato(id: number){
    return this.http.get(`${this.API_URI}/contratoEmpleado/${id}`);
  }

  BuscarContratoIdEmpleado(id: number){
    return this.http.get<any>(`${this.API_URI}/contratoEmpleado/contrato/${id}`);
  }

  BuscarContratoEmpleadoRegimen(id: number){
    return this.http.get<any>(`${this.API_URI}/contratoEmpleado/contratoRegimen/${id}`);
  }
  
  
  // servicio para obtener la lista de las nacionalidades
  getListaNacionalidades(){
    return this.http.get<any>(`${this.API_URI}/nacionalidades`)
  }

  // servicios para subir las imagenes
  subirImagen(formData, idEmpleado: number) {
    return this.http.put(`${this.API_URI}/empleado/${idEmpleado}/uploadImage`, formData)  
  }

  DownloadXMLRest(data: any) {
    return this.http.post(`${this.API_URI}/empleado/xmlDownload`, data);
  }
  // verXML(name: string){
  //   return this.http.get<any>(`${this.API_URI}/empleado/download/${name}`)
  // }

}
