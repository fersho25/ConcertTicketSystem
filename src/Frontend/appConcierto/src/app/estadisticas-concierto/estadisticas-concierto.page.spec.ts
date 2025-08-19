import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadisticasConciertoPage } from './estadisticas-concierto.page';

describe('EstadisticasConciertoPage', () => {
  let component: EstadisticasConciertoPage;
  let fixture: ComponentFixture<EstadisticasConciertoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasConciertoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
