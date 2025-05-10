// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  public errorMessage: string = '';
  registerForm: FormGroup;

  showToast = false;
  toastMessage = '';
  toastColor = 'bg-success'; 

  passwordChecks = {
    minLength: false,
    hasLetter: false,
    hasNumber: false,
    hasUppercase: false,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private http: HttpClient 
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });

    // Validaciones reactivas en tiempo real
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.onPasswordInput();
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity();
    });
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onPasswordInput(): void {
    const value = this.registerForm.get('password')?.value || '';
    this.passwordChecks.minLength = value.length >= 8;
    this.passwordChecks.hasLetter = /[A-Za-z]/.test(value);
    this.passwordChecks.hasNumber = /\d/.test(value);
    this.passwordChecks.hasUppercase = /[A-Z]/.test(value);
  }

  onSubmit() {
    console.log("Formulario válido?", this.registerForm.valid);
    console.log("Datos del formulario:", this.registerForm.value);

    if (this.registerForm.invalid) {
      console.warn('Formulario inválido. No se envía.');
      return;
    }

    const usuario: Usuario = {
      username: this.registerForm.get('nombre')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: 'USER' as const
    };
    

    console.log('Objeto enviado al backend:', usuario);

    this.userService.crearUsuario(usuario).subscribe({
      next: (resp) => {
        console.log('Usuario creado exitosamente:', resp);
        this.toastMessage = 'Registro exitoso';
        this.toastColor = 'bg-success';
        this.showToast = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.errorMessage = 'Error al registrar usuario';
        this.toastColor = 'bg-danger';
        this.showToast = true;
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}
