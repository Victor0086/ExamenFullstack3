import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  // ✅ Método que estaba faltando:
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/crear`, usuario);
  }

  // Ya definido:
  modificarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modificar/${id}`, datos);
  }
 getUsuarios(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.apiUrl}`);
}


  
}
