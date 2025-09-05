import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VizualizarMusicas } from './visualizar-musicas';

describe('VizualizarMusicas', () => {
  let component: VizualizarMusicas;
  let fixture: ComponentFixture<VizualizarMusicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VizualizarMusicas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VizualizarMusicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
