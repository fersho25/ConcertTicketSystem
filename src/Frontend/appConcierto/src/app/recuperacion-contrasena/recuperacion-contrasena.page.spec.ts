import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperacionContrasenaPage } from './recuperacion-contrasena.page';

describe('RecuperacionContrasenaPage', () => {
  let component: RecuperacionContrasenaPage;
  let fixture: ComponentFixture<RecuperacionContrasenaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperacionContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
