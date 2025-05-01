import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from '../../../app/components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar inválido si el formulario está vacío', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería marcar válido si el formulario tiene datos', () => {
    component.loginForm.setValue({ username: 'admin', password: '1234' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('debería llamar a authService.login() si el formulario es válido', () => {
    const authServiceSpy = spyOn(component['authService'], 'login').and.callThrough();

    component.loginForm.setValue({ username: 'admin', password: '1234' });
    component.onSubmit();

    expect(authServiceSpy).toHaveBeenCalled();
  });
  
  it('debería tener formulario válido si se completa correctamente', () => {
    component.loginForm.setValue({ username: 'admin', password: '1234Abcd' });
    expect(component.loginForm.valid).toBeTrue();
  });
  
  it('debería llamar al método onSubmit solo si el formulario es válido', () => {
    const spy = spyOn(component['authService'], 'login').and.callThrough();
  
    component.loginForm.setValue({ username: 'admin', password: '1234Abcd' });
    component.onSubmit();
  
    expect(spy).toHaveBeenCalled();
  });
  
  it('no debería llamar a login si el formulario es inválido', () => {
    const spy = spyOn(component['authService'], 'login');
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
  
    expect(spy).not.toHaveBeenCalled();
  });
  
});
