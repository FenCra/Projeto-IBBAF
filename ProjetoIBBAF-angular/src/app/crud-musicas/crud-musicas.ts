import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MusicasService } from '../musicas';
import { Header } from '../header/header';

@Component({
  selector: 'app-crud-musicas',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './crud-musicas.html',
  styleUrls: ['./crud-musicas.css']
})
export class CrudMusicas implements OnInit {
  musicas: any[] = [];

  constructor(private musicasService: MusicasService) { }

  ngOnInit() {
    this.carregarMusicas();
  }

  carregarMusicas() {
    this.musicasService.getMusicas().subscribe({
      next: (data) => {
        this.musicas = data as any[];
      },
      error: (err) => {
        console.error('Erro ao carregar as músicas', err);
      }
    });
  }

  deletarMusica(id: number) {
    if (confirm('Tem certeza que deseja deletar esta música?')) {
      this.musicasService.deleteMusica(id).subscribe({
        next: () => {
          this.carregarMusicas();
        },
        error: (err) => {
          console.error('Erro ao deletar a música', err);
        }
      });
    }
  }
}