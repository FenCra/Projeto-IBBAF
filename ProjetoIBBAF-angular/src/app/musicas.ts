import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicasService {
  private apiUrl = 'http://localhost:3000/api/musicas';

  constructor(private http: HttpClient) { }

  // READ: Busca todas as músicas
  getMusicas() {
    return this.http.get(this.apiUrl);
  }

  // READ: Busca músicas por letra
  getMusicasPorLetra(letra: string) {
    return this.http.get(`${this.apiUrl}/letra/${letra}`);
  }

  // CREATE: Adiciona uma nova música
  addMusica(musica: any) {
    return this.http.post(this.apiUrl, musica);
  }

  // UPDATE: Atualiza uma música existente
  updateMusica(id: number, musica: any) {
    return this.http.put(`${this.apiUrl}/${id}`, musica);
  }

  // DELETE: Deleta uma música
  deleteMusica(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Busca uma única música pelo ID
  getMusicaById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }  
}