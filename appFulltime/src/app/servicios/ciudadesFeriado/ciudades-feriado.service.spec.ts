import { TestBed } from '@angular/core/testing';

import { CiudadesFeriadoService } from './ciudades-feriado.service';

describe('CiudadesFeriadoService', () => {
  let service: CiudadesFeriadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiudadesFeriadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
