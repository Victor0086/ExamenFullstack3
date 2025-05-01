import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }

  register(usuario: any) {
    return this.http.post(`${this.apiUrl}/usuarios/crear`, usuario);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/crear`, usuario);
  }
}
