import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicasService } from '../musicas';
import { Header } from '../header/header';


@Component({
  selector: 'app-formulario-musicas',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './formulario-musicas.html',
  styleUrls: ['./formulario-musicas.css']
})
export class FormularioMusicas implements OnInit {
  musica: any = { id: null, nome: '', letra: '' };
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musicasService: MusicasService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.musicasService.getMusicaById(Number(id)).subscribe({
          next: (data: any) => {
            this.musica = data;
          },
          error: (err: any) => {
            console.error('Erro ao buscar a música para edição', err);
          }
        });
      }
    });
  }

  salvarMusica() {
    if (this.isEditMode) {
      // Lógica de edição (UPDATE)
      this.musicasService.updateMusica(this.musica.id, this.musica).subscribe({
        next: () => this.router.navigate(['/crud']),
        error: (err: any) => console.error('Erro ao atualizar a música', err)
      });
    } else {
      // Lógica de adição (CREATE)
      this.musicasService.addMusica(this.musica).subscribe({
        next: () => this.router.navigate(['/crud']),
        error: (err: any) => console.error('Erro ao adicionar a música', err)
      });
    }
    this.router.navigate(['/crud']);
  }
  cancelar() {
    this.router.navigate(['/crud']);
  }
}