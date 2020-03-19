import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloEmpleadoComponent } from './titulo-empleado.component';

describe('TituloEmpleadoComponent', () => {
  let component: TituloEmpleadoComponent;
  let fixture: ComponentFixture<TituloEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TituloEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TituloEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
