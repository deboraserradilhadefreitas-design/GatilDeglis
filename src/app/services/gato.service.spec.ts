import { TestBed } from '@angular/core/testing';

import { GatoService } from './gato.service';

describe('GatoService', () => {
  let service: GatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
