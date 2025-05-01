import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from '../../../app/components/register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../../app/services/user.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['crearUsuario']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener formulario inválido si está vacío', () => {
    component.registerForm.setValue({
      nombre: '',
      password: '',
      confirmPassword: '',
      email: ''
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería tener formulario válido si está completo', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234Abcd',
      confirmPassword: '1234Abcd',
      email: 'test@mail.com'
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('debería llamar a userService.crearUsuario() si el formulario es válido', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234Abcd',
      confirmPassword: '1234Abcd',
      email: 'test@mail.com'
    });

    userServiceSpy.crearUsuario.and.returnValue(of({
      username: 'mockUser',
      email: 'mock@mail.com',
      password: 'mockPassword',
      role: 'USER'
    }));

    component.onSubmit();

    expect(userServiceSpy.crearUsuario).toHaveBeenCalled();
  });

  it('debería manejar errores cuando crearUsuario() falla', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234Abcd',
      confirmPassword: '1234Abcd',
      email: 'test@mail.com'
    });

    userServiceSpy.crearUsuario.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(userServiceSpy.crearUsuario).toHaveBeenCalled();
  });

  it('debería mostrar mensaje de éxito al crear usuario', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234Abcd',
      confirmPassword: '1234Abcd',
      email: 'test@mail.com'
    });

    userServiceSpy.crearUsuario.and.returnValue(of({
      username: 'mockUser',
      email: 'mock@mail.com',
      password: 'mockPassword',
      role: 'USER'
    }));

    component.onSubmit();

    expect(component.toastMessage).toBe('Registro exitoso');
    expect(component.toastColor).toBe('bg-success');
    expect(component.showToast).toBeTrue();
  });

  it('debería mostrar mensaje de error si crearUsuario falla', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234Abcd',
      confirmPassword: '1234Abcd',
      email: 'test@mail.com'
    });

    userServiceSpy.crearUsuario.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(component.toastMessage).toBe('Error al registrar usuario');
    expect(component.toastColor).toBe('bg-danger');
    expect(component.showToast).toBeTrue();
  });
  it('debería marcar error si las contraseñas no coinciden', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234Abcd',
      confirmPassword: 'otraClave',
      email: 'test@mail.com'
    });
  
    const errors = component.registerForm.errors;
    expect(errors).toEqual({ passwordMismatch: true });
  });
  it('debería marcar error si la contraseña no cumple con los requisitos', () => {
    component.registerForm.setValue({
      nombre: 'nuevo',
      password: '1234',
      confirmPassword: '1234',
      email: 'test@mail.com'
    });
  
    const passwordErrors = component.registerForm.get('password')?.errors;
    expect(passwordErrors).toBeTruthy();
    expect(passwordErrors?.['pattern']).toBeTruthy();
  });
  
    it('debería navegar a la página de login al hacer clic en "Ir a Login"', () => {
        const routerSpy = spyOn(component['router'], 'navigate');
        component.irALogin();
        expect(routerSpy).toHaveBeenCalledWith(['/login']);
    });  

    it('debería actualizar las validaciones de password al escribir', () => {
        const control = component.registerForm.get('password');
        control?.setValue('Abc12345');
        component.onPasswordInput();
      
        expect(component.passwordChecks.minLength).toBeTrue();
        expect(component.passwordChecks.hasLetter).toBeTrue();
        expect(component.passwordChecks.hasNumber).toBeTrue();
        expect(component.passwordChecks.hasUppercase).toBeTrue();
      });

      it('debería navegar al inicio con volverAlInicio()', () => {
        const routerSpy = spyOn(component['router'], 'navigate');
        component.volverAlInicio();
        expect(routerSpy).toHaveBeenCalledWith(['/']);
      });
        it('debería mostrar el toast al crear usuario', () => {
            component.showToast = true;
            expect(component.showToast).toBeTrue();
        });      
      
});
