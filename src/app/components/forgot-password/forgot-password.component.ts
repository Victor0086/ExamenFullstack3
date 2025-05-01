import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    const email = this.forgotForm.value.email;

    this.http.get<boolean>(`http://localhost:8080/usuarios/existe-email?email=${email}`)
      .subscribe(existe => {
        if (existe) {
          this.mensaje = 'Instrucciones enviadas al correo.';
          console.log('Simulando envío de correo a:', email);
        } else {
          this.mensaje = 'El correo no está registrado.';
        }
      });
  }
}
