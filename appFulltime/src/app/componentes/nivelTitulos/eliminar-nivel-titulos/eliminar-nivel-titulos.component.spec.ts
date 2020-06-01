import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarNivelTitulosComponent } from './eliminar-nivel-titulos.component';

describe('EliminarNivelTitulosComponent', () => {
  let component: EliminarNivelTitulosComponent;
  let fixture: ComponentFixture<EliminarNivelTitulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarNivelTitulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarNivelTitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
