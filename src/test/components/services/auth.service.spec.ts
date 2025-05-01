import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../app/services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer POST a /auth/login', () => {
    const mockData = { username: 'admin', password: '1234' };

    service.login(mockData).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush({});
  });

  it('debería hacer POST a /usuarios/crear desde register', () => {
    const usuario = { username: 'new', password: 'pass' };

    service.register(usuario).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/usuarios/crear');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería hacer POST a /usuarios/crear desde crearUsuario()', () => {
    const usuario = { username: 'new2', password: 'pass2' };

    service.crearUsuario(usuario).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/usuarios/crear');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería eliminar "usuario" del localStorage al cerrar sesión', () => {
    localStorage.setItem('usuario', 'data');
    service.logout();
    expect(localStorage.getItem('usuario')).toBeNull();
  });
});
