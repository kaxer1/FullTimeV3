import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URI = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  postCredenciales(data: any) {
    return this.http.post(`${this.API_URI}/login`, data);
  }
  
}
