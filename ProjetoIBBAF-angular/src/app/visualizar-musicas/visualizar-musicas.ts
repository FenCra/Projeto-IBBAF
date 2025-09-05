import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicasService } from '../musicas';
import { Header } from '../header/header';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visualizar-musicas',
  standalone: true,
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './visualizar-musicas.html',
  styleUrls: ['./visualizar-musicas.css']
})
export class VisualizarMusicas implements OnInit {
  musicasAgrupadas: { [key: string]: any[] } = {};
  letrasDoAlfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private musicasService: MusicasService) { }

  ngOnInit() {
    this.carregarMusicas();
  }

  carregarMusicas() {
    this.musicasService.getMusicas().subscribe({
      next: (data: any) => {
        const musicas = data as any[];
        this.agruparMusicasPorLetra(musicas);
      },
      error: (err: any) => {
        console.error('Erro ao carregar as músicas', err);
      }
    });
  }

  agruparMusicasPorLetra(musicas: any[]) {
    this.musicasAgrupadas = {};
    this.letrasDoAlfabeto.forEach(letra => {
      this.musicasAgrupadas[letra] = [];
    });

    musicas.sort((a, b) => a.nome.localeCompare(b.nome));

    musicas.forEach(musica => {
      const primeiraLetra = musica.nome.charAt(0).toUpperCase();
      if (this.musicasAgrupadas[primeiraLetra]) {
        this.musicasAgrupadas[primeiraLetra].push(musica);
      }
    });
  }

  temMusicas(letras: { [key: string]: any[] }) {
    return Object.keys(letras).some(key => letras[key].length > 0);
  }
}