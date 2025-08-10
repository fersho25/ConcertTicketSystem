import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearConciertoPage } from './crear-concierto.page';

describe('CrearConciertoPage', () => {
  let component: CrearConciertoPage;
  let fixture: ComponentFixture<CrearConciertoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearConciertoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
