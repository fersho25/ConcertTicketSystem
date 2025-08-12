import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdicionConciertoPage } from './edicion-concierto.page';

describe('EdicionConciertoPage', () => {
  let component: EdicionConciertoPage;
  let fixture: ComponentFixture<EdicionConciertoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionConciertoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
