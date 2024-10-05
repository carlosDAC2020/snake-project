import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// componentes
import { ListGamesComponent } from '../list-games/list-games.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ListGamesComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
