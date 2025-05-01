import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tema } from '../models/tema.model';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';


@Injectable({
  providedIn: 'root',
})
export class TemaService {
  private apiUrl = 'http://localhost:8080/temas';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('http://localhost:8080/categorias');
  }
  

  // Obtener todos los temas
  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.apiUrl);
  }

  // Eliminar un tema por ID (requiere objeto Usuario como cuerpo del request)
  eliminarTema(id: number, solicitante: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, {
      body: solicitante
    });
  }  

  // Crear un nuevo tema
  crearTema(tema: Tema): Observable<Tema> {
    return this.http.post<Tema>(`${this.apiUrl}/crear`, tema);
  }

  // Obtener un tema por ID
  getTemaPorId(id: number): Observable<Tema> {
    return this.http.get<Tema>(`${this.apiUrl}/${id}`);
  }

  // Modificar un tema existente
  modificarTema(id: number, tema: Tema): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/modificar/${id}`, tema);
  }

  // Banear un tema (requiere usuario solicitante)
  banearTema(id: number, solicitante: { id: number, role: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/banear/${id}`, solicitante);
  }
}
