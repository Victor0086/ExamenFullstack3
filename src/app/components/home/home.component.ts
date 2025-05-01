import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  usuarioLogueado: any = null;
  rol: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('usuario');
    this.usuarioLogueado = user ? JSON.parse(user) : null;

    console.log('Usuario logueado:', this.usuarioLogueado);

    // Solo accede al rol si hay usuario logueado
    this.rol = this.usuarioLogueado?.role || '';
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  irAlAdmin() {
    this.router.navigate(['/admin']);
  }

  irAlForo() {
    this.router.navigate(['/foro']);
  }
}
