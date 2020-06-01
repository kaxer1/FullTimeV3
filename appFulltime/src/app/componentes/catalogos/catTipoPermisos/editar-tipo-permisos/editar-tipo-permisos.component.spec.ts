import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoPermisosComponent } from './editar-tipo-permisos.component';

describe('EditarTipoPermisosComponent', () => {
  let component: EditarTipoPermisosComponent;
  let fixture: ComponentFixture<EditarTipoPermisosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarTipoPermisosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTipoPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
