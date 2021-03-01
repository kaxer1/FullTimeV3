import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {

  API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerBirthdayEmpresa(id_empresa: number){
    return this.http.get(`${this.API_URL}/birthday/${id_empresa}`);
  }

  CrearBirthday(data: any){ 
    return this.http.post(`${this.API_URL}/birthday`, data);
  }

  EditarBirthday(id_birthday: number, data: any) {
    return this.http.put(`${this.API_URL}/birthday/editar/${id_birthday}`, data)
  }

  SubirImagenBirthday(formData, id_empresa: number) {
    return this.http.put(`${this.API_URL}/birthday/${id_empresa}/uploadImage`, formData)
  }

}
