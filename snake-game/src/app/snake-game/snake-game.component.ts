import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Food } from '../models/food';
import { Router } from '@angular/router'; // Importa Router
import { ActivatedRoute } from '@angular/router'; // obtener parametros de url
// services
import { GameService } from '../services/game/game.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit {

  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;

  snakeEffect: string = '';
  currentSpeed: number = 100;

  regularFood: Food = { x: 0, y: 0, points: 10, color: 'red' };
  specialFood: Food = { x: 0, y: 0, points: 20, color: 'blue', speedIncrease: true, speedDuration: 10 };
  superSpecialFood: Food = { x: 0, y: 0, points: 50, color: 'gold', speedIncrease: true, speedDuration: 20 };

  canvasWidth: number = 900;
  canvasHeight: number = 600;

  gridSize: number = 10;
  snake: { x: number, y: number }[] = [{ x: 400, y: 350 }];
  direction: { x: number, y: number } = { x: 0, y: -this.gridSize };
  food: Food = { x: 0, y: 0, points: 10, color: 'red' };
  gameInterval: any;

  inPley: boolean = false;

  score: number = 0;
  gameTime: number = 0;
  gameTimeInterval: any = null;

  lastFoodWasSuperSpecial: boolean = false;

  dificult: string = '';
  obstacles: { x: number, y: number }[] = [];

  constructor(
    private gameService:GameService,
    private auth:AuthService,
    private router: Router,
    private params: ActivatedRoute,
  ) {
    this.inPley = false;
  }

  ngOnInit() {
    this.params.queryParams.subscribe(parms => {
      this.dificult = parms['dificult'];
    });
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (this.ctx) {
      this.placeSnake(); // Colocar la serpiente al cargar el componente
      this.placeFood(); // Colocar la comida al cargar el componente
      this.placeObstacles(); // Colocar obstáculos al cargar el componente
      this.drawAll(); // Dibuja todo al cargar
    } else {
      console.error("El contexto del canvas no se pudo inicializar");
    }
  }

  saveGame(){
    // Datos del juego: Solo con dificultad, pero con valores por defecto para los demás campos
    const gameData = {
      score: this.score, // El puntaje será asignado por el backend de forma aleatoria
      difficulty: this.dificult || '', // Dificultad seleccionada, o vacío si no está definida
    };
  
    // Obtener el token de autenticación
    const token = this.auth.getToken();
  
    if (token) {
      this.gameService.saveGame(gameData, token).subscribe({
        next: (response) => {
          console.log('Partida generada:', response);
          alert('Juego terminado. Tu puntuación: ' + this.score);
          this.router.navigate(['/Snake-Game/home']); 
        },
        error: (err) => {
          console.error('Error al guar la partida:', err);
          alert('Ocurrió un error al iniciar la partida.'); // Mensaje de error
        }
      });
    } else {
      console.error('Token no disponible');
      alert('No se ha podido autenticar. Por favor, inicia sesión nuevamente.');
      this.router.navigate(['/Snake-Game/login']); // Redirigir a la página de login
    }
  }

  placeSnake() {
    this.snake = [{ x: 400, y: 350 }]; // Posición inicial de la serpiente
  }

  toggleGame() {
    this.inPley = !this.inPley;

    if (this.inPley) {
      this.startGame();
    } else {
      this.pauseGame();
    }
  }

  startGame() {
    if (!this.gameInterval) {
      this.gameInterval = setInterval(() => this.gameLoop(), 100);
      if (!this.gameTimeInterval) {
        this.gameTimeInterval = setInterval(() => this.gameTime++, 1000);
      }
    }
  }

  pauseGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    if (this.gameTimeInterval) {
      clearInterval(this.gameTimeInterval);
      this.gameTimeInterval = null;
    }
  }

  placeFood() {
    const randomType = Math.random();
  
    if (this.lastFoodWasSuperSpecial) {
      this.food = this.regularFood;
    } else {
      if (randomType < 0.05) {
        this.food = this.superSpecialFood;
      } else if (randomType < 0.15) {
        this.food = this.specialFood;
      } else {
        this.food = this.regularFood;
      }
    }
  
    let x, y;
    // Asegúrate de que la comida no aparezca en el mismo lugar que la serpiente o los obstáculos
    do {
      x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize)) * this.gridSize;
      y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize)) * this.gridSize;
    } while (this.isPositionOccupied(x, y));
  
    this.food.x = x;
    this.food.y = y;
  }
  

  placeObstacles() {
    const obstacleCount = this.dificult === 'Easy' ? 0 : this.dificult === 'Half' ? 50 : 150;

    this.obstacles = [];
    for (let i = 0; i < obstacleCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize)) * this.gridSize;
        y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize)) * this.gridSize;
      } while (this.isPositionOccupied(x, y));
      this.obstacles.push({ x, y });
    }
  }

  isPositionOccupied(x: number, y: number): boolean {
    if (this.snake.some(segment => segment.x === x && segment.y === y)) {
      return true;
    }
    if (this.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y)) {
      return true;
    }
    return false;
  }

  drawAll() {
    this.drawSnake();
    this.drawFood();
    this.drawObstacles();
  }

  gameLoop() {
    this.moveSnake();
    this.checkCollision();
    this.drawAll();
  }

  drawSnake() {
    this.ctx!.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.snake.forEach((segment) => {
      if (this.snakeEffect === 'faster') {
        this.ctx!.fillStyle = 'yellow';
      } else {
        this.ctx!.fillStyle = 'green';
      }

      this.ctx!.fillRect(segment.x, segment.y, this.gridSize, this.gridSize);
    });
  }

  drawFood() {
    this.ctx!.fillStyle = this.food.color;
    this.ctx!.fillRect(this.food.x, this.food.y, this.gridSize, this.gridSize);
  }

  drawObstacles() {
    this.ctx!.fillStyle = 'gray'; // Color de los obstáculos
    this.obstacles.forEach(obstacle => {
      this.ctx!.fillRect(obstacle.x, obstacle.y, this.gridSize, this.gridSize);
    });
  }

  moveSnake() {
    const newHead = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };
    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += this.food.points;

      if (this.food === this.superSpecialFood) {
        this.lastFoodWasSuperSpecial = true;
      } else {
        this.lastFoodWasSuperSpecial = false;
      }

      if (this.food.speedIncrease) {
        const duration = this.food.speedDuration || 0;
        this.increaseSpeed(duration);
      }

      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  increaseSpeed(duration: number) {
    clearInterval(this.gameInterval);
    let speedIncreaseAmount = 30;
    let newSpeed = Math.max(50, this.currentSpeed - speedIncreaseAmount);

    if (this.food === this.superSpecialFood) {
      newSpeed = Math.max(50, this.currentSpeed - (speedIncreaseAmount * 2));
    }

    this.gameInterval = setInterval(() => this.gameLoop(), newSpeed);
    this.snakeEffect = 'faster';

    setTimeout(() => {
      this.restoreSpeed();
    }, duration * 1000);
  }

  restoreSpeed() {
    clearInterval(this.gameInterval);
    this.snakeEffect = '';
    this.gameInterval = setInterval(() => this.gameLoop(), this.currentSpeed);
  }

  checkCollision() {
    const head = this.snake[0];

    // Verificar colisiones con las paredes
    if (head.x < 0 || head.x >= this.canvasWidth || head.y < 0 || head.y >= this.canvasHeight) {
      this.endGame();
    }

    // Verificar colisiones con el cuerpo de la serpiente
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.endGame();
      }
    }

    // Verificar colisiones con obstáculos
    for (const obstacle of this.obstacles) {
      if (head.x === obstacle.x && head.y === obstacle.y) {
        this.endGame();
      }
    }
  }

  endGame() {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
    clearInterval(this.gameTimeInterval);
    this.gameTimeInterval = null;
    this.saveGame()
  }

  resetGame() {
    this.score = 0;
    this.placeSnake(); // Colocar la serpiente al reiniciar
    this.direction = { x: 0, y: -this.gridSize };
    this.placeFood();
    this.placeObstacles(); // Colocar obstáculos al reiniciar
    this.drawAll(); // Dibuja todo al reiniciar
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.inPley) {
      this.toggleGame();
    }
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction.y === 0) this.direction = { x: 0, y: -this.gridSize };
        break;
      case 'ArrowDown':
        if (this.direction.y === 0) this.direction = { x: 0, y: this.gridSize };
        break;
      case 'ArrowLeft':
        if (this.direction.x === 0) this.direction = { x: -this.gridSize, y: 0 };
        break;
      case 'ArrowRight':
        if (this.direction.x === 0) this.direction = { x: this.gridSize, y: 0 };
        break;
    }
  }

  changeDifficulty(difficulty: string) {
    this.dificult = difficulty;
    this.placeObstacles(); // Recolocar obstáculos al cambiar la dificultad
  }
}
