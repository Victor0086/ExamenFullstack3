import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['modificarUsuario']);

    // Simula usuario antes de crear componente
    localStorage.setItem('usuario', JSON.stringify({
      id: 1,
      username: 'modificado',
      email: 'nuevo@test.com',
      role: 'ADMIN'
    }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, ProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a modificarUsuario() cuando el formulario es válido y se envía', fakeAsync(() => {
    // Setea formulario con valores válidos
    component.profileForm.setValue({
      username: 'modificado',
      email: 'nuevo@test.com',
      role: 'ADMIN'
    });

    userServiceSpy.modificarUsuario.and.returnValue(of({
      id: 1,
      username: 'modificado',
      email: 'nuevo@test.com',
      role: 'ADMIN'
    }));

    component.onSubmit();
    tick();

    expect(userServiceSpy.modificarUsuario).toHaveBeenCalledWith(
      1,
      jasmine.objectContaining({
        username: 'modificado',
        email: 'nuevo@test.com',
        role: 'ADMIN'
      })
    );
  }));

    it('no debería llamar a modificarUsuario si el formulario es inválido', () => {
    component.profileForm.setValue({
        username: '',
        email: 'invalido',
        role: ''
    });

    const spy = spyOn(component['userService'], 'modificarUsuario');
    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
    });

    it('debería cargar usuario desde localStorage al iniciar', () => {
    const usuarioMock = { id: 1, username: 'admin', role: 'ADMIN', email: 'admin@test.com' };
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));

    component.ngOnInit();

    expect(component.profileForm.value.username).toBe('admin');
    });


});
