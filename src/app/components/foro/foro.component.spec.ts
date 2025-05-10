
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ForoComponent } from './foro.component';
import { TemaService } from 'app/services/tema.service';
import { Tema } from 'app/models/tema.model';
import { Usuario } from 'app/models/usuario.model';
import { Categoria } from 'app/models/categoria.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForoComponent', () => {
  let component: ForoComponent;
  let fixture: ComponentFixture<ForoComponent>;
  let mockTemaService: jasmine.SpyObj<TemaService>;

  const usuarioMock: Usuario = {
    id: 1,
    username: 'usuarioTest',
    role: 'USER',
    password: '',
    email: ''
  };

  const categoriaMock: Categoria = {
    id: 1,
    nombre: 'Tech'
  };

  const temaMock: Tema = {
    id: 1,
    titulo: 'Tema de prueba',
    contenido: 'Contenido de prueba',
    categoria: categoriaMock,
    usuario: usuarioMock,
    fechaPublicacion: new Date(),
    comentarios: [],
    baneado: false
  };

  beforeEach(async () => {
    mockTemaService = jasmine.createSpyObj('TemaService', [
      'getTemas', 'getCategorias', 'crearTema', 'modificarTema', 'eliminarTema'
    ]);

    mockTemaService.getTemas.and.returnValue(of([temaMock]));
    mockTemaService.getCategorias.and.returnValue(of([categoriaMock]));
    mockTemaService.crearTema.and.returnValue(of(temaMock));
    mockTemaService.modificarTema.and.returnValue(of(temaMock));
    mockTemaService.eliminarTema.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [ForoComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: TemaService, useValue: mockTemaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForoComponent);
    component = fixture.componentInstance;
    component.usuarioLogueado = usuarioMock;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar temas al inicializar', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(mockTemaService.getTemas).toHaveBeenCalled();
    expect(component.temas.length).toBeGreaterThan(0);
  }));

  it('debería cargar categorías al inicializar', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(mockTemaService.getCategorias).toHaveBeenCalled();
    expect(component.categorias.length).toBeGreaterThan(0);
  }));

  it('debería crear un tema cuando el formulario es válido', () => {
    component.usuarioLogueado = usuarioMock;
    component.temaForm.setValue({
      titulo: 'Nuevo tema',
      descripcion: 'Contenido del tema',
      categoria: categoriaMock.id.toString()
    });
    component.crearTema();
    expect(mockTemaService.crearTema).toHaveBeenCalled();
  });

  it('no debería crear un tema si el formulario es inválido', () => {
    component.temaForm.reset();
    component.crearTema();
    expect(mockTemaService.crearTema).not.toHaveBeenCalled();
  });

  it('debería asignar el tema a editar', () => {
    component.editarTema(temaMock);
    expect(component.temaEnEdicion).toEqual(temaMock);
  });

  it('debería cancelar la edición', () => {
    component.temaEnEdicion = temaMock;
    component.cancelarEdicion();
    expect(component.temaEnEdicion).toBeNull();
  });

  it('debería guardar los cambios de edición', () => {
    component.usuarioLogueado = usuarioMock;
    component.temas = [temaMock];
    component.editarTema(temaMock);
    component.temaForm.setValue({
      titulo: 'Tema actualizado',
      descripcion: 'Contenido actualizado',
      categoria: '1'
    });

    component.guardarCambios();

    expect(mockTemaService.modificarTema).toHaveBeenCalledWith(1, jasmine.objectContaining({
      titulo: 'Tema actualizado',
      contenido: 'Contenido actualizado',
      categoria: jasmine.objectContaining({ id: 1 })
    }));
    expect(component.temaEnEdicion).toBeNull();
  });

  it('debería eliminar un tema', () => {
    component.usuarioLogueado = usuarioMock;
    spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarTema(1);
    expect(mockTemaService.eliminarTema).toHaveBeenCalledWith(1, usuarioMock);
  });

  it('no debería eliminar el tema si se cancela el confirm()', () => {
  component.usuarioLogueado = usuarioMock;
  spyOn(window, 'confirm').and.returnValue(false); // usuario cancela
  component.eliminarTema(1);
  expect(mockTemaService.eliminarTema).not.toHaveBeenCalled();
});

});