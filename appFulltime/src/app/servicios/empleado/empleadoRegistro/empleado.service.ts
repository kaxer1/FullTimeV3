import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from "file-saver";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  API_URI = 'http://192.168.0.192:3001';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  // Empleados  
  getEmpleadosRest() {
    return this.http.get(`${this.API_URI}/empleado`);
  }
  
  getBuscadorEmpledosRest() {
    return this.http.get<any>(`${this.API_URI}/empleado/buscador-empl`);
  }

  getOneEmpleadoRest(id: number) {
    return this.http.get<any>(`${this.API_URI}/empleado/${id}`);
  }

  postEmpleadoRest(data: any) {
    return this.http.post(`${this.API_URI}/empleado`, data)
      .pipe(
        catchError(data)
      );
  }

  putEmpleadoRest(data: any, id: number) {
    return this.http.put(`${this.API_URI}/empleado/${id}/usuario`, data)
      .pipe(
        catchError(data)
      );
  }

  subirArchivoExcel(formData) {
    return this.http.post(`${this.API_URI}/empleado/plantillaExcel/`, formData);
  }

  // Servicio para insertar el empleado con sus respectivos titulos
  postEmpleadoTitulos(data: any) {
    return this.http.post(`${this.API_URI}/empleado/emplTitulos`, data);
  }

  getEmpleadoTituloRest(id: number) {
    return this.http.get(`${this.API_URI}/empleado/emplTitulos/${id}`);
  }

  putEmpleadoTituloRest(id: number, data: any) {
    return this.http.put(`${this.API_URI}/empleado/${id}/titulo`, data);
  }

  deleteEmpleadoTituloRest(id: number) {
    return this.http.delete(`${this.API_URI}/empleado/eliminar/titulo/${id}`);
  }

  // Servicio para insertar contrato del empleado
  CrearContratoEmpleado(datos: any) {
    return this.http.post(`${this.API_URI}/contratoEmpleado`, datos);
  }

  ObtenerUnContrato(id: number) {
    return this.http.get(`${this.API_URI}/contratoEmpleado/${id}/get`);
  }

  ActualizarContratoEmpleado(id: number, id_empleado: number, data: any) {
    return this.http.put(`${this.API_URI}/contratoEmpleado/${id_empleado}/${id}/actualizar/`, data);
  }

  BuscarIDContrato(id: number) {
    return this.http.get(`${this.API_URI}/contratoEmpleado/${id}`);
  }

  BuscarIDContratoActual(id: number) {
    return this.http.get(`${this.API_URI}/contratoEmpleado/contratoActual/${id}`);
  }

  BuscarDatosContrato(id: number) {
    return this.http.get<any>(`${this.API_URI}/contratoEmpleado/contrato/${id}`);
  }

  BuscarContratoEmpleadoRegimen(id: number) {
    return this.http.get<any>(`${this.API_URI}/contratoEmpleado/contratoRegimen/${id}`);
  }

  SubirContrato(formData, id: number) {
    return this.http.put(`${this.API_URI}/contratoEmpleado/${id}/documento`, formData)
  }

  EditarDocumento(id: number, data: any) {
    return this.http.put(`${this.API_URI}/contratoEmpleado/editar/editarDocumento/${id}`, data);
  }

  BuscarFechaContrato(datos: any) {
    return this.http.post(`${this.API_URI}/contratoEmpleado/buscarFecha`, datos);
  }

  BuscarFechaIdContrato(datos: any) {
    return this.http.post(`${this.API_URI}/contratoEmpleado/buscarFecha/contrato`, datos);
  }

  ObtenerContratos() {
    return this.http.get<any>(`${this.API_URI}/contratoEmpleado`);
  }




  // GUARDAR CODIGO

  CrearCodigo(datos: any) {
    return this.http.post(`${this.API_URI}/empleado/crearCodigo`, datos);
  }

  ObtenerCodigo() {
    return this.http.get(`${this.API_URI}/empleado/encontrarDato/codigo`);
  }

  ActualizarCodigo(datos: any) {
    return this.http.put(`${this.API_URI}/empleado/cambiarCodigo`, datos);
  }

  // servicio para obtener la lista de las nacionalidades
  getListaNacionalidades() {
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

  BuscarDepartamentoEmpleado(datos: any) {
    return this.http.post(`${this.API_URI}/empleado/buscarDepartamento`, datos);
  }

  // Desactivar varios empleados seleccionados
  DesactivarVariosUsuarios(data: any[]) {
    return this.http.put<any>(`${this.API_URI}/empleado/desactivar/masivo`, data)
  }
  
  ActivarVariosUsuarios(data: any[]) {
    return this.http.put<any>(`${this.API_URI}/empleado/activar/masivo`, data)
  }
  
  ReActivarVariosUsuarios(data: any[]) {
    return this.http.put<any>(`${this.API_URI}/empleado/re-activar/masivo`, data)
  }
  
  ListaEmpleadosDesactivados() {
    return this.http.get<any>(`${this.API_URI}/empleado/desactivados/empleados`);
  }

}
