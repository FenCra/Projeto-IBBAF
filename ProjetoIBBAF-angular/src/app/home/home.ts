import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, Header],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}  