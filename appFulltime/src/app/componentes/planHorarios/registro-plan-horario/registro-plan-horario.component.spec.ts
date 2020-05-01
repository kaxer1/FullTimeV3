import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPlanHorarioComponent } from './registro-plan-horario.component';

describe('RegistroPlanHorarioComponent', () => {
  let component: RegistroPlanHorarioComponent;
  let fixture: ComponentFixture<RegistroPlanHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroPlanHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPlanHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
