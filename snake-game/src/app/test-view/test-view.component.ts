import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

interface Point {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
  color: string;
}

@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-view.component.html',
  styleUrl: './test-view.component.css'
})
export class TestViewComponent implements OnInit{

  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

 WIDTH = 1280;
 HEIGHT = 720;
 INITIAL_BODY_PARTS = 20;
 BASE_SPEED = 2.5;
 ACCELERATION_FACTOR = 2.0;
 BASE_SIZE = 48;
 snake: Point[] = [];
 foods: Food[] = [];
 currentSpeed = this.BASE_SPEED;
 running = false;
 score = 0;
 glowColor = 'rgba(46, 204, 113, 0.5)'; // Color de brillo para efecto visual
 backgroundColor = '#3498db';
 paused = false;
 showStartScreen = true;

 context!: CanvasRenderingContext2D;
 mouseX = this.WIDTH / 2;
 mouseY = this.HEIGHT / 2;

  ngOnInit(): void {
    this.context = this.canvasRef.nativeElement.getContext('2d')!;
    this.initGame();
  }

  private initGame(): void {
    this.snake = Array.from({ length: this.INITIAL_BODY_PARTS }, (_, i) => ({
      x: this.WIDTH / 2 - i * 5,
      y: this.HEIGHT / 2
    }));
    this.generateFoods(100);
  }

  startGame(): void {
    this.showStartScreen = false;
    this.running = true;
    this.score = 0;
    this.loop();
  }

  private generateFoods(count: number): void {
    this.foods = Array.from({ length: count }, () => ({
      x: Math.random() * this.WIDTH * 3 - this.WIDTH,
      y: Math.random() * this.HEIGHT * 3 - this.HEIGHT,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    }));
  }

  private loop(): void {
    if (!this.running) return;

    this.move();
    this.checkFoodCollision();
    this.checkCollisions();
    this.drawGame();

    requestAnimationFrame(() => this.loop());
  }

  private move(): void {
    if (this.paused) return;

    let head = this.snake[0];
    const angle = Math.atan2(this.mouseY - this.HEIGHT / 2, this.mouseX - this.WIDTH / 2);
    const newX = head.x + this.currentSpeed * Math.cos(angle);
    const newY = head.y + this.currentSpeed * Math.sin(angle);

    // Añadir nueva posición de cabeza
    this.snake.unshift({ x: newX, y: newY });

    // Limitar el tamaño de la serpiente
    while (this.snake.length > this.INITIAL_BODY_PARTS + this.score) {
      this.snake.pop();
    }
  }

  private checkFoodCollision(): void {
    const head = this.snake[0];
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const food = this.foods[i];
      if (Math.hypot(head.x - food.x, head.y - food.y) < 10) {
        this.score++;
        this.foods.splice(i, 1);
        this.foods.push({
          x: Math.random() * this.WIDTH * 3 - this.WIDTH,
          y: Math.random() * this.HEIGHT * 3 - this.HEIGHT,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
        break;
      }
    }
  }

  private checkCollisions(): void {
    const head = this.snake[0];

    // Verificar colisión con los bordes
    if (head.x < 0 || head.x > this.WIDTH || head.y < 0 || head.y > this.HEIGHT) {
      this.running = false;
      alert('Game Over');
    }

    // Verificar colisión con el propio cuerpo
    for (let i = 4; i < this.snake.length; i++) {
      if (Math.hypot(head.x - this.snake[i].x, head.y - this.snake[i].y) < 5) {
        this.running = false;
        alert('Game Over');
        break;
      }
    }
  }

  private drawGame(): void {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Dibujar comida
    for (const food of this.foods) {
      this.context.fillStyle = food.color;
      this.context.beginPath();
      this.context.arc(food.x, food.y, 5, 0, Math.PI * 2);
      this.context.fill();
    }

    // Dibujar serpiente
    for (let i = 0; i < this.snake.length; i++) {
      const part = this.snake[i];
      this.context.fillStyle = `rgba(46, 204, 113, ${1 - i / this.snake.length})`;
      this.context.beginPath();
      this.context.arc(part.x, part.y, 10 - i / 5, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

}
