import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  public errorMensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const data = this.loginForm.value;
    console.log(' Login enviado:', data);

    this.authService.login(data).subscribe({
      next: (response) => {
        console.log(' Respuesta del backend:', response);

        // Validamos explícitamente los campos
        if (response && response.username && response.role) {
          localStorage.setItem('usuario', JSON.stringify(response));
          alert(`Bienvenido ${response.username}`);
          const ruta = response.role === 'ADMIN' ? '/admin' : '/foro';
          this.router.navigate([ruta]);
        } else {
          console.warn(' Respuesta inesperada:', response);
          alert('Credenciales inválidas');
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        alert('Credenciales inválidas');
      }
    });
  }
}
