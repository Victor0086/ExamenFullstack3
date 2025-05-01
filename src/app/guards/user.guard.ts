import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('usuario');
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
