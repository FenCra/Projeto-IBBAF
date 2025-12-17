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
    this.letrasDoAlfabeto.forEach(letra => {
      this.musicasService.getMusicasPorLetra(letra).subscribe({
        next: (data: any) => {
          this.musicasAgrupadas[letra] = data as any[];
        },
        error: (err: any) => {
          console.error(`Erro ao carregar músicas para a letra ${letra}`, err);
          this.musicasAgrupadas[letra] = [];
        }
      });
    });
  }

  temMusicas(letras: { [key: string]: any[] }) {
    return Object.keys(letras).some(key => letras[key].length > 0);
  }
}