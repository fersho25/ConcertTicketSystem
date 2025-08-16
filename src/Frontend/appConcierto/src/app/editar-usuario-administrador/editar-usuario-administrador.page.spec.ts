import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarUsuarioAdministradorPage } from './editar-usuario-administrador.page';

describe('EditarUsuarioAdministradorPage', () => {
  let component: EditarUsuarioAdministradorPage;
  let fixture: ComponentFixture<EditarUsuarioAdministradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarUsuarioAdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
