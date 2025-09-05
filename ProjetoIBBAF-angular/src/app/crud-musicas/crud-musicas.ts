import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MusicasService } from '../musicas';
import { Header } from '../header/header';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-musicas',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, FormsModule],
  templateUrl: './crud-musicas.html',
  styleUrls: ['./crud-musicas.css']
})
export class CrudMusicas implements OnInit {
  musicas: any[] = [];
  musicasFiltradas: any[] = [];
  searchTerm: string = '';
  musicaEmEdicao: any = {};

  constructor(private musicasService: MusicasService) { }

  ngOnInit() {
    this.carregarMusicas();
  }

  carregarMusicas() {
    this.musicasService.getMusicas().subscribe({
      next: (data) => {
        this.musicas = data as any[];

        this.musicasFiltradas = [...this.musicas]; 
      },
      error: (err) => {
        console.error('Erro ao carregar as músicas', err);
      }
    });
  }

  filtrarMusicas() {

    if (!this.searchTerm.trim()) {
      this.musicasFiltradas = [...this.musicas]; 
    } else {
      const termo = this.searchTerm.trim().toLowerCase();

      this.musicasFiltradas = this.musicas.filter(musica =>
        (musica.nome && musica.nome.toLowerCase().includes(termo)) 

      );
    }
  }

  editarMusica(musica: any): void {
    this.musicaEmEdicao = { ...musica };
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