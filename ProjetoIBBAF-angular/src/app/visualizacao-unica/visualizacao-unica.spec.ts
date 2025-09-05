import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoUnica } from './visualizacao-unica';

describe('VisualizacaoUnica', () => {
  let component: VisualizacaoUnica;
  let fixture: ComponentFixture<VisualizacaoUnica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacaoUnica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoUnica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
