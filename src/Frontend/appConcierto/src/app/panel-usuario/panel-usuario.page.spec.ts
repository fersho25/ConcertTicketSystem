import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelUsuarioPage } from './panel-usuario.page';

describe('PanelUsuarioPage', () => {
  let component: PanelUsuarioPage;
  let fixture: ComponentFixture<PanelUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
