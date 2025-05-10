import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, CommonModule],
     providers: [
            { provide: Router, useValue: routerSpy },
            { provide: ActivatedRoute, useValue: {} }
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el rol si hay usuario en localStorage', () => {
    const usuarioMock = { username: 'admin', role: 'ADMIN' };
    localStorage.setItem('usuario', JSON.stringify(usuarioMock));

    component.ngOnInit();

    expect(component.usuarioLogueado).toEqual(usuarioMock);
    expect(component.rol).toBe('ADMIN');
  });

  it('debería navegar a /login con irALogin()', () => {
    component.irALogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería borrar usuario y navegar a /login con cerrarSesion()', () => {
    localStorage.setItem('usuario', JSON.stringify({ username: 'admin' }));
    component.cerrarSesion();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería navegar a /admin con irAlAdmin()', () => {
    component.irAlAdmin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería navegar a /foro con irAlForo()', () => {
    component.irAlForo();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/foro']);
  });
});
