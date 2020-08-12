import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHorasExtrasComponent } from './ver-horas-extras.component';

describe('VerHorasExtrasComponent', () => {
  let component: VerHorasExtrasComponent;
  let fixture: ComponentFixture<VerHorasExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerHorasExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerHorasExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
