import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicasService } from '../musicas';
import { Header } from '../header/header';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-apresentacao',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './apresentacao-musicas.html',
  styleUrls: ['./apresentacao-musicas.css']
})
export class Apresentacao implements OnInit {
  termoBusca: string = '';
  todasMusicas: any[] = [];
  musicasQueComecam: any[] = [];
  musicasQueContem: any[] = [];

  constructor(private musicasService: MusicasService) { }

  ngOnInit() {
    this.musicasService.getMusicas().subscribe((data: any) => {
      this.todasMusicas = data;
    });
  }

  normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '').toLowerCase();
  }

  filtrarMusicas() {
    const termo = this.termoBusca.toLowerCase().trim();
    const termoNormalizado = this.normalizarTexto(termo);
    this.musicasQueComecam = [];
    this.musicasQueContem = [];

    if (termo === '') {
      return;
    }

    this.musicasQueComecam = this.todasMusicas.filter(musica =>
      this.normalizarTexto(musica.nome).startsWith(termoNormalizado)
    );

    this.musicasQueContem = this.todasMusicas.filter(musica =>
      !this.normalizarTexto(musica.nome).startsWith(termoNormalizado) &&
      (this.normalizarTexto(musica.nome).includes(termoNormalizado) || this.normalizarTexto(musica.letra).includes(termoNormalizado))
    );
  }
}