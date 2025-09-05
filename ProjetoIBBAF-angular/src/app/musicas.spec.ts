import { TestBed } from '@angular/core/testing';

import { Musicas } from './musicas';

describe('Musicas', () => {
  let service: Musicas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Musicas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
