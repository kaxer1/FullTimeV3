import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarNivelTituloComponent } from './editar-nivel-titulo.component';

describe('EditarNivelTituloComponent', () => {
  let component: EditarNivelTituloComponent;
  let fixture: ComponentFixture<EditarNivelTituloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarNivelTituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarNivelTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
