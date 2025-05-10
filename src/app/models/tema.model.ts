import { Categoria } from './categoria.model';
import { Comentario } from './comentario.model';
import { Usuario } from './usuario.model'; 

export interface Tema {
  id: number;
  titulo: string;
  contenido: string;
  categoria: Categoria;
  usuario: Usuario; 
  fechaPublicacion: Date;
  comentarios: Comentario[];
  baneado?: boolean;
}
