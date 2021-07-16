import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEmpleadosParaTimbresComponent } from './lista-empleados-para-timbres.component';

describe('ListaEmpleadosParaTimbresComponent', () => {
  let component: ListaEmpleadosParaTimbresComponent;
  let fixture: ComponentFixture<ListaEmpleadosParaTimbresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEmpleadosParaTimbresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEmpleadosParaTimbresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
