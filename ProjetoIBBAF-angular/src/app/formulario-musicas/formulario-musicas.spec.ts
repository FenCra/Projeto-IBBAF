import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioMusicas } from './formulario-musicas';

describe('FormularioMusicas', () => {
  let component: FormularioMusicas;
  let fixture: ComponentFixture<FormularioMusicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioMusicas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioMusicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
