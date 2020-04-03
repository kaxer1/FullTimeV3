import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaElementosComponent } from './vista-elementos.component';

describe('VistaElementosComponent', () => {
  let component: VistaElementosComponent;
  let fixture: ComponentFixture<VistaElementosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaElementosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaElementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
