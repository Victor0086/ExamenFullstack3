import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Usuario } from '../models/usuario.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests pendientes
  });

  it('debería ser creado correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería enviar una solicitud POST al crearUsuario', () => {
    const mockUsuario: Usuario = {
      username: 'nuevo',
      email: 'nuevo@test.com',
      password: '1234Abcd',
      role: 'USER'
    };

    service.crearUsuario(mockUsuario).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/usuarios/crear');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUsuario);
    req.flush({});
  });

  it('debería enviar una solicitud PUT al modificarUsuario', () => {
    const mockUsuario: Usuario = {
      username: 'admin',
      email: 'nuevo@test.com',
      password: '',
      role: 'ADMIN'
    };

    service.modificarUsuario(1, mockUsuario).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/usuarios/modificar/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUsuario);
    req.flush({});
  });

  it('debería enviar una solicitud GET al getUsuarios', () => {
    const usuariosMock: Usuario[] = [
      { username: 'uno', email: 'uno@test.com', password: '1234Abcd', role: 'USER' }
    ];

    service.getUsuarios().subscribe(data => {
      expect(data).toEqual(usuariosMock);
    });

    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(usuariosMock);
  });

    it('debería enviar una solicitud GET al getUsuarios', () => {
    const usuariosMock: Usuario[] = [
        { username: 'uno', email: 'uno@test.com', password: '1234Abcd', role: 'USER' }
    ];

    service.getUsuarios().subscribe(data => {
        expect(data).toEqual(usuariosMock);
    });

    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(usuariosMock);
    });

        it('debería manejar error al crear usuario', () => {
    const mockUsuario: Usuario = { username: 'fallo', email: 'falla@test.com', password: '1234Abcd', role: 'USER' };

    service.crearUsuario(mockUsuario).subscribe({
        next: () => fail('Debería fallar'),
        error: (error) => {
        expect(error.status).toBe(500);
        }
    });

    const req = httpMock.expectOne('http://localhost:8080/usuarios/crear');
    expect(req.request.method).toBe('POST');
    req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });
    });

    it('debería manejar error al modificar usuario', () => {
  const datosMock = { username: 'errorUser', email: 'error@mail.com', role: 'USER' };

  service.modificarUsuario(99, datosMock).subscribe({
    next: () => fail('Se esperaba un error'),
    error: (error) => {
      expect(error.status).toBe(400);
    }
  });

    const req = httpMock.expectOne('http://localhost:8080/usuarios/modificar/99');
    expect(req.request.method).toBe('PUT');
    req.flush('Error al modificar', { status: 400, statusText: 'Bad Request' });
    });

    it('debería retornar un arreglo vacío si no hay usuarios', () => {
    service.getUsuarios().subscribe(data => {
        expect(data.length).toBe(0);
    });

    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    });




});
