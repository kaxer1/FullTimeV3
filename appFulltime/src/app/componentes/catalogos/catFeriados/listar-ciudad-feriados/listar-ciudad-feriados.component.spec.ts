import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCiudadFeriadosComponent } from './listar-ciudad-feriados.component';

describe('ListarCiudadFeriadosComponent', () => {
  let component: ListarCiudadFeriadosComponent;
  let fixture: ComponentFixture<ListarCiudadFeriadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCiudadFeriadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCiudadFeriadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
