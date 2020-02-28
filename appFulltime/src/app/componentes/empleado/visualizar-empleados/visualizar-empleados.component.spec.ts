import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEmpleadosComponent } from './visualizar-empleados.component';

describe('VisualizarEmpleadosComponent', () => {
  let component: VisualizarEmpleadosComponent;
  let fixture: ComponentFixture<VisualizarEmpleadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarEmpleadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
