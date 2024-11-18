import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router'; // Importa Router

// Services 
import { GameService } from '../services/game/game.service';
import { AuthService } from '../services/auth/auth.service';
import { SoundService } from '../services/sound/sound.service';

// Models
import { Game } from '../models/game';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {}; // Variable para almacenar la información del usuario
  games: Game[] = []; // Para almacenar las partidas del usuario
  updatedUser: { username?: string; password?: string } = {}; // Para almacenar los datos del formulario de actualización
  updateSuccess: boolean = false; // Para mostrar un mensaje de éxito
  updateError: boolean = false; // Para mostrar un mensaje de error

  // estdos fictocios de juego 
  gameEnd:boolean=false; 
  scoreGamen:number=0;
  dategame:any;
  difict:any;
  selectedDifficulty: string = 'Easy'; // Dificultad predeterminada
  selectedControl: string = 'keyboard'; // Control predeterminado


  constructor(
    private gameService: GameService,
    private auth: AuthService,
    private router: Router,
    private soundService: SoundService,
  ) {
    this.soundService.stoppleyStart();
    this.soundService.playBackground();
  }

  // Selector de sección de perfil 
  IsSetting: string = "games";

  changeActionProfile(action: string) {
    this.IsSetting = action;
  }

  // Selector de dificultad 
 

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
  }

  selectControl(control: string) {
    this.selectedControl = control;
  }

  ngOnInit() {
    this.loadUserProfile(); // Cargar datos del perfil al iniciar
    this.loadUserGames(); 
  }

  loadUserProfile() {
    this.auth.getUserProfile().subscribe({
      next: (response) => {
        console.log(response);
        this.user = response.user; 
        this.updatedUser.username = this.user.username
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario', err);
      }
    });
  }

  loadUserGames() {
    this.gameService.getUserGames(this.auth.getToken()!).subscribe({
      next: (response) => {
        console.log(response);
        this.games = response; 
      },
      error: (err) => {
        console.error('Error al cargar las partidas del usuario', err);
      }
    });
  }

  // Método para actualizar el perfil del usuario
  updateProfile() {
    this.auth.editData(this.updatedUser).subscribe({
      next: (response) => {
        console.log('Perfil actualizado:', response);
        this.updateSuccess = true; // Marcar éxito
        this.updateError = false; // Resetear error
        // Actualizar la información del usuario en la variable local
        this.user.username = this.updatedUser.username || this.user.username;
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        this.updateError = true; // Marcar error
        this.updateSuccess = false; // Resetear éxito
      }
    });
  }

   // Método para eliminar la cuenta del usuario
   deleteAccount() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.auth.deleteAccount().subscribe({
        next: () => {
          console.log('Cuenta eliminada con éxito');
          alert('Tu cuenta ha sido eliminada con éxito.');
          // Redirige al usuario a la ruta /index
          this.auth.logout()
          this.router.navigate(['/index']); // Redirección
        },
        error: (err) => {
          console.error('Error al eliminar la cuenta:', err);
          alert('Ocurrió un error al intentar eliminar la cuenta.'); // Mostrar un mensaje de error
        }
      });
    }
  }

  logout(){
    this.auth.logout()
    this.router.navigate(['/Snake-Game/index']);
  }


  startGame() {
    this.router.navigate(['/snake'],{ queryParams: { dificult: this.selectedDifficulty, control: this.selectedControl } });
  }
  
  // Nueva función para actualizar la lista de juegos
  updateGameList() {
    this.gameService.getUserGames(this.auth.getToken()!).subscribe({
      next: (games) => {
        this.games = games; // Asigna los juegos obtenidos a la lista en el frontend
      },
      error: (err) => {
        console.error('Error al actualizar la lista de juegos:', err);
      }
    });
  }
    
}
