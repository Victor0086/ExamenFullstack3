import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tema } from 'app/models/tema.model';
import { Categoria } from 'app/models/categoria.model';
import { Usuario } from 'app/models/usuario.model';
import { TemaService } from 'app/services/tema.service';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './foro.component.html',
  providers: [TemaService],
})
export class ForoComponent implements OnInit {
  temaForm!: FormGroup;
  temas: Tema[] = [];
  categorias: Categoria[] = [];
  temaEnEdicion: Tema | null = null;
  usuarioLogueado: Usuario | null = null;

  constructor(private temaService: TemaService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.inicializarFormulario();
    this.cargarTemas();
    this.cargarCategorias(); 
  }

  inicializarFormulario() {
    this.temaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required] 
    });
  }

  obtenerUsuario() {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      this.usuarioLogueado = JSON.parse(usuarioString);
    }
  }

  cargarTemas() {
    this.temaService.getTemas().subscribe((temas) => {
      this.temas = temas;
    });
  }

  cargarCategorias() {
    this.temaService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  crearTema() {
    if (this.temaForm.valid && this.usuarioLogueado) {
      const nuevoTema: Tema = {
        id: 0,
        titulo: this.temaForm.value.titulo,
        contenido: this.temaForm.value.descripcion,
        fechaPublicacion: new Date(),
        categoria: {
          id: +this.temaForm.value.categoria,
          nombre: '' 
        },
        usuario: this.usuarioLogueado,
        comentarios: []
      };
  
      this.temaService.crearTema(nuevoTema).subscribe({
        next: () => {
          this.temaForm.reset();
          this.cargarTemas();
        },
        error: (err) => console.error('Error al crear tema', err)
      });
    }
  }
  
  editarTema(tema: Tema) {
    this.temaEnEdicion = { ...tema };
  }

  guardarCambios() {
    if (!this.temaEnEdicion) return;

    this.temaService.modificarTema(this.temaEnEdicion.id, this.temaEnEdicion).subscribe(() => {
      this.temaEnEdicion = null;
      this.cargarTemas();
    });
  }

  cancelarEdicion() {
    this.temaEnEdicion = null;
  }

  eliminarTema(id: number) {
    const confirmado = confirm('¿Estás seguro de que deseas eliminar este tema?');
    if (!confirmado || !this.usuarioLogueado) return;

    this.temaService.eliminarTema(id, this.usuarioLogueado).subscribe(() => {
      this.cargarTemas();
    });
  }
}
