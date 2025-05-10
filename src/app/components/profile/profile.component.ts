import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from 'app/models/usuario.model';
import { UserService } from 'app/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  providers: [UserService],
})
export class ProfileComponent implements OnInit {
  public profileForm!: FormGroup;
  public usuario: Usuario | null = null;
  public mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.inicializarFormulario();
  }

  obtenerUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  inicializarFormulario(): void {
    this.profileForm = this.fb.group({
      username: [this.usuario?.username || '', [Validators.required]],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
      role: [this.usuario?.role || 'USER', [Validators.required]]
    });
  }

onSubmit(): void {
  if (this.profileForm.valid && this.usuario) {
    const datosActualizados = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      role: this.profileForm.value.role
    };

    this.userService.modificarUsuario(this.usuario.id!, datosActualizados).subscribe({
      next: (resp) => {
        console.log('Perfil actualizado:', resp);
        this.usuario = { ...this.usuario!, ...datosActualizados };
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        this.mensajeError = 'Error al registrar usuario'; 
      }
    });
  }
}

  
}
