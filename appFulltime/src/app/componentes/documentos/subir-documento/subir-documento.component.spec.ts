import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirDocumentoComponent } from './subir-documento.component';

describe('SubirDocumentoComponent', () => {
  let component: SubirDocumentoComponent;
  let fixture: ComponentFixture<SubirDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
