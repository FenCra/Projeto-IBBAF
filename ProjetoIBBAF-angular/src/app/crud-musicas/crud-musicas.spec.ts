import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudMusicas } from './crud-musicas';

describe('CrudMusicas', () => {
  let component: CrudMusicas;
  let fixture: ComponentFixture<CrudMusicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudMusicas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudMusicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
