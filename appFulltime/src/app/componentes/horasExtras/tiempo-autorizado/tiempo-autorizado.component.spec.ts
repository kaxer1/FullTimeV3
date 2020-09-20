import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiempoAutorizadoComponent } from './tiempo-autorizado.component';

describe('TiempoAutorizadoComponent', () => {
  let component: TiempoAutorizadoComponent;
  let fixture: ComponentFixture<TiempoAutorizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiempoAutorizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiempoAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
