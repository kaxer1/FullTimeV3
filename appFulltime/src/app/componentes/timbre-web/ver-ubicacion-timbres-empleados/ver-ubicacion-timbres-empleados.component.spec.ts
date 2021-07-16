import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUbicacionTimbresEmpleadosComponent } from './ver-ubicacion-timbres-empleados.component';

describe('VerUbicacionTimbresEmpleadosComponent', () => {
  let component: VerUbicacionTimbresEmpleadosComponent;
  let fixture: ComponentFixture<VerUbicacionTimbresEmpleadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerUbicacionTimbresEmpleadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerUbicacionTimbresEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
