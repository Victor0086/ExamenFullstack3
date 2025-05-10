import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['crearUsuario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('debería llamar a crearUsuario() y redirigir si el formulario es válido', fakeAsync(() => {
    const mockResponse: Usuario = {
      username: 'mockUser',
      email: 'mock@mail.com',
      password: 'mockPassword',
      role: 'USER'
    };
    userServiceSpy.crearUsuario.and.returnValue(of(mockResponse));

    component.registerForm.setValue({
      nombre: 'nuevo',
      email: 'test@mail.com',
      password: '1234Abcd',
      confirmPassword: '1234Abcd'
    });

    component.onSubmit();
    tick(3000);

    expect(userServiceSpy.crearUsuario).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

    it('debería mostrar mensaje de error si crearUsuario falla', fakeAsync(() => {
    userServiceSpy.crearUsuario.and.returnValue(throwError(() => new Error('Error')));

    component.registerForm.setValue({
        nombre: 'nuevo',
        email: 'test@mail.com',
        password: '1234Abcd',
        confirmPassword: '1234Abcd'
    });

    component.onSubmit();
    tick(); // Espera la ejecución de subscribe
    fixture.detectChanges(); // Refresca bindings si hay algún template

    expect(component.errorMessage).toBe('Error al registrar usuario');
    }));

});

