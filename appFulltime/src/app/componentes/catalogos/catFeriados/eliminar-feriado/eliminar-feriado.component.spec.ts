import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarFeriadoComponent } from './eliminar-feriado.component';

describe('EliminarFeriadoComponent', () => {
  let component: EliminarFeriadoComponent;
  let fixture: ComponentFixture<EliminarFeriadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarFeriadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarFeriadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
