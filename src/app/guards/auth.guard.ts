import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!user || user.role !== 'ADMIN') {
      alert('Acceso denegado. Solo usuarios ADMIN pueden ingresar.');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem('usuario');
  }
}