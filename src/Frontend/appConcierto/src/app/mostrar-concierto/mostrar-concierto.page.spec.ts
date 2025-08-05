import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarConciertoPage } from './mostrar-concierto.page';

describe('MostrarConciertoPage', () => {
  let component: MostrarConciertoPage;
  let fixture: ComponentFixture<MostrarConciertoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarConciertoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
