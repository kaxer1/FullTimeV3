import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HorarioService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Catálogo de Horarios
  getHorariosRest(){
    return this.http.get(`${this.API_URL}/horario`);
  }

  getOneHorarioRest(id:number){
    return this.http.get(`${this.API_URL}/horario/${id}`);
  }
  
  postHorarioRest(data: any){
    return this.http.post(`${this.API_URL}/horario`, data);
  } 

  UploadExcel(formData: FormData) {  
    let headers = new HttpHeaders();  
  
    headers.append('Content-Type', 'multipart/form-data');  
    headers.append('Accept', 'application/json');  
  
    const httpOptions = { headers: headers };  
  
    return this.http.post(this.API_URL + 'horario/upload', formData, httpOptions)  
  }

}
