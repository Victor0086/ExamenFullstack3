import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tema } from 'app/models/tema.model';
import { TemaService } from 'app/services/tema.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  temas: Tema[] = [];
  temaEnEdicion: Tema | null = null;
  usuarioLogueado: any = null;

  constructor(
    private temaService: TemaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTemas();
    const user = localStorage.getItem('usuario');
    this.usuarioLogueado = user ? JSON.parse(user) : null;
  }

  cargarTemas(): void {
    this.temaService.getTemas().subscribe((temas) => {
      this.temas = temas;
    });
  }

  eliminarTema(id: number): void {
    const confirmado = confirm('¿Estás seguro de que deseas eliminar este tema?');
    if (confirmado) {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      this.temaService.eliminarTema(id, usuario).subscribe(() => {
        this.cargarTemas();
      });
    }
  }

  editarTema(tema: Tema) {
    this.temaEnEdicion = { ...tema };
  }

  guardarCambios() {
    if (!this.temaEnEdicion) return;
    this.temaService.modificarTema(this.temaEnEdicion.id, this.temaEnEdicion).subscribe(() => {
      this.cargarTemas();
      this.temaEnEdicion = null;
    });
  }

  cancelarEdicion() {
    this.temaEnEdicion = null;
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  irAInicio() {
    this.router.navigate(['/']);
  }
}
