import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelEdicionPage } from './panel-edicion.page';

describe('PanelEdicionPage', () => {
  let component: PanelEdicionPage;
  let fixture: ComponentFixture<PanelEdicionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelEdicionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
