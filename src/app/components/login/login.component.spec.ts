import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'foro', component: DummyComponent },
          { path: 'admin', component: DummyComponent }
        ]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ],
      declarations: [DummyComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('no debería llamar a login si el formulario es inválido', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debería hacer login exitoso y navegar', fakeAsync(() => {
    const mockResponse = { token: 'fake-token', username: 'admin', role: 'ADMIN' };
    authServiceSpy.login.and.returnValue(of(mockResponse));
    const navigateSpy = spyOn(router, 'navigate');

    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería mostrar error si login falla', fakeAsync(() => {
    spyOn(window, 'alert');
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login fallido')));

    component.loginForm.setValue({ username: 'admin', password: 'wrongpass' });
    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Credenciales inválidas');
  }));

  it('debería mostrar mensaje si el token está ausente en la respuesta', fakeAsync(() => {
    spyOn(window, 'alert');
    authServiceSpy.login.and.returnValue(of({}));

    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Credenciales inválidas');
  }));
});
