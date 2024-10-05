import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

// servicio de juegos 
import { GameService } from '../services/game/game.service';  

// modelos 
import { Game } from '../models/game';

@Component({
  selector: 'app-list-games',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-games.component.html',
  styleUrls: ['./list-games.component.css']
})
export class ListGamesComponent implements OnInit {
  selectedDifficulty: string = 'easy'; // Dificultad predeterminada
  games: Game[] = [];  // Lista de partidas
  filteredGames: Game[] = []; // Lista filtrada de partidas
  usernameFilter: string = ''; // Filtro por nombre de usuario

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadGames();
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.filterGames(); // Filtra al cambiar la dificultad
  }

  loadGames() {
    // Llama al servicio para obtener la lista de partidas
    this.gameService.getGames().subscribe({
      next: (response) => {
        this.games = response;
        this.filterGames(); // Filtra los juegos al cargar
      },
      error: (err) => {
        console.error('Error al cargar las partidas', err);
      }
    });
  }

  // Método para filtrar juegos
  filterGames() {
    this.filteredGames = this.games.filter(game => {
      const matchesUsername = game.user.toLowerCase().includes(this.usernameFilter.toLowerCase());
      const matchesDifficulty = game.difficulty.toLowerCase() === this.selectedDifficulty;
      return matchesUsername && matchesDifficulty;
    });
  }
}
