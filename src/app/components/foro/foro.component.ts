// foro.component.ts corregido
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemaService } from 'app/services/tema.service';
import { Tema } from 'app/models/tema.model';
import { Categoria } from 'app/models/categoria.model';
import { Usuario } from 'app/models/usuario.model';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './foro.component.html',
})
export class ForoComponent implements OnInit {
  temaForm!: FormGroup;
  temas: Tema[] = [];
  categorias: Categoria[] = [];
  temaEnEdicion: Tema | null = null;
  usuarioLogueado: Usuario | null = null;

  constructor(private fb: FormBuilder, private temaService: TemaService) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.inicializarFormulario();
    this.cargarTemas();
    this.cargarCategorias();
  }

  inicializarFormulario(): void {
    this.temaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', Validators.required]
    });
  }

  obtenerUsuario(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      this.usuarioLogueado = JSON.parse(usuarioString);
    }
  }

  cargarTemas(): void {
    this.temaService.getTemas().subscribe((temas) => {
      this.temas = temas;
    });
  }

  cargarCategorias(): void {
    this.temaService.getCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  crearTema(): void {
    if (this.temaForm.valid && this.usuarioLogueado) {
      const nuevoTema: Tema = {
        id: 0,
        titulo: this.temaForm.value.titulo,
        contenido: this.temaForm.value.descripcion,
        categoria: { id: +this.temaForm.value.categoria, nombre: '' },
        usuario: this.usuarioLogueado,
        fechaPublicacion: new Date(),
        comentarios: [],
        baneado: false
      };

      this.temaService.crearTema(nuevoTema).subscribe(() => {
        this.temaForm.reset();
        this.cargarTemas();
      });
    }
  }

  editarTema(tema: Tema): void {
    this.temaEnEdicion = { ...tema };
    this.temaForm.patchValue({
      titulo: tema.titulo,
      descripcion: tema.contenido,
      categoria: tema.categoria.id.toString()
    });
  }

  cancelarEdicion(): void {
    this.temaEnEdicion = null;
    this.temaForm.reset();
  }

  guardarCambios(): void {
    if (this.temaEnEdicion && this.temaForm.valid) {
      const temaActualizado: Tema = {
        ...this.temaEnEdicion,
        titulo: this.temaForm.value.titulo,
        contenido: this.temaForm.value.descripcion,
        categoria: { id: +this.temaForm.value.categoria, nombre: '' }
      };

      this.temaService.modificarTema(this.temaEnEdicion.id, temaActualizado).subscribe(() => {
        this.temaEnEdicion = null;
        this.cargarTemas();
      });
    }
  }

  eliminarTema(id: number): void {
    if (this.usuarioLogueado && confirm('¿Estás seguro de que deseas eliminar este tema?')) {
      this.temaService.eliminarTema(id, this.usuarioLogueado).subscribe(() => {
        this.cargarTemas();
      });
    }
  }



}