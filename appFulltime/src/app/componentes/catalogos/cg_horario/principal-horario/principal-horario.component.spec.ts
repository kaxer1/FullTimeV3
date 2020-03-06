import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalHorarioComponent } from './principal-horario.component';

describe('PrincipalHorarioComponent', () => {
  let component: PrincipalHorarioComponent;
  let fixture: ComponentFixture<PrincipalHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
