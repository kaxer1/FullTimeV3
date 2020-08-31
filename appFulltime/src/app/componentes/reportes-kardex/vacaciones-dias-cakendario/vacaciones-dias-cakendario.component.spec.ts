import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacacionesDiasCakendarioComponent } from './vacaciones-dias-cakendario.component';

describe('VacacionesDiasCakendarioComponent', () => {
  let component: VacacionesDiasCakendarioComponent;
  let fixture: ComponentFixture<VacacionesDiasCakendarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacacionesDiasCakendarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacacionesDiasCakendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
