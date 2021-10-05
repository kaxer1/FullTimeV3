import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteKardexComponent } from './reporte-kardex.component';

describe('ReporteKardexComponent', () => {
  let component: ReporteKardexComponent;
  let fixture: ComponentFixture<ReporteKardexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteKardexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteKardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
