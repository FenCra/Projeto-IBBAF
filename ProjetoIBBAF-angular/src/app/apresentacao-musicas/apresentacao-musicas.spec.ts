import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApresentacaoMusicas } from './apresentacao-musicas';

describe('ApresentacaoMusicas', () => {
  let component: ApresentacaoMusicas;
  let fixture: ComponentFixture<ApresentacaoMusicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApresentacaoMusicas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApresentacaoMusicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
