import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [UserGuard]
  },
  {
    path: 'foro',
    loadComponent: () =>
      import('./components/foro/foro.component').then(m => m.ForoComponent),
    canActivate: [UserGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
