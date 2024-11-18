import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private backgroundAudio: HTMLAudioElement;
  private eatAudio: HTMLAudioElement;
  private speedUpAudio: HTMLAudioElement;
  private gameOverAudio: HTMLAudioElement;
  private playstart : HTMLAudioElement;

  constructor() {
    // Inicializar los sonidos con las rutas correctas
    this.backgroundAudio = new Audio('../../../assets/backgraund.mp4');
    this.backgroundAudio.loop = true; // Sonido de fondo en bucle
    this.backgroundAudio.volume = 0.5;

    this.eatAudio = new Audio('../../../assets/food.wav'); // Usar formato MP3
    this.eatAudio.volume = 0.5;
    this.speedUpAudio = new Audio('../../../assets/speed.wav'); // Usar formato MP3
    this.speedUpAudio.loop = true; 
    this.eatAudio.volume = 0.5;
    this.gameOverAudio = new Audio('../../../assets/gameOver.wav'); // Usar formato MP3
    this.gameOverAudio.volume = 0.5;
    this.playstart = new Audio('../../../assets/game_back.wav'); // Usar formato MP3
    this.playstart.loop = true; // Sonido de fondo en bucle
    this.playstart.volume = 0.5;
  }

  // Reproducir sonido de fondo
  playBackground(): void {
    this.backgroundAudio.play();
  }

  stopBackground(): void {
    this.backgroundAudio.pause();
    this.backgroundAudio.currentTime = 0; // Reinicia el sonido
  }

  // incio de modo de juego 
  playStart(): void {
    this.backgroundAudio.pause();
    this.playstart.play();
  }

  stoppleyStart(): void {
    this.playstart.pause();
    this.playstart.currentTime = 0; // Reinicia el sonido
  }

  // Reproducir sonido cuando la serpiente coma
  playEat(): void {
    this.eatAudio.play();
  }

  // Reproducir sonido cuando aumente la velocidad
  playSpeedUp(): void {
    this.speedUpAudio.play();
  }

  stopspeedUp(): void {
    this.speedUpAudio.pause();
    this.speedUpAudio.currentTime = 0; // Reinicia el sonido
  }

  // Reproducir sonido cuando la serpiente muera
  playGameOver(): void {
    this.stopBackground(); // Detener el sonido de fondo
    this.playstart.pause(); 
    this.gameOverAudio.play();
  }
}
