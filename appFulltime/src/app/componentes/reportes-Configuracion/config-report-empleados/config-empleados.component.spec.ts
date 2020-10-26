import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEmpleadosComponent } from './config-empleados.component';

describe('ConfigEmpleadosComponent', () => {
  let component: ConfigEmpleadosComponent;
  let fixture: ComponentFixture<ConfigEmpleadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigEmpleadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
