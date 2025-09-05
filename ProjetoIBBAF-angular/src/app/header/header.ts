import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})

export class Header {
  constructor(private location: Location, private router: Router) { }

  voltar() {
    const url = this.location.path();
    if (url.includes('/musica/')) {
      this.router.navigate(['/apresentacao']);
    } else if (url.includes('/adicionar-musica') || url.includes('/editar-musica')) {
    } else {
      this.router.navigate(['/']);
    }
  }
}