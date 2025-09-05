import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MusicasService } from '../musicas';
import { Header } from '../header/header';

@Component({
  selector: 'app-visualizacao-unica',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './visualizacao-unica.html',
  styleUrls: ['./visualizacao-unica.css']
})
export class VisualizacaoUnica implements OnInit {
  musica: any;

  constructor(
    private route: ActivatedRoute,
    private musicasService: MusicasService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.musicasService.getMusicaById(Number(id)).subscribe({
          next: (data: any) => {
            this.musica = data;
          },
          error: (err: any) => {
            console.error('Erro ao buscar a música', err);
          }
        });
      }
    });
  }
}