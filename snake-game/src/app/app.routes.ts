import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

// componentes
import { SnakeGameComponent } from './snake-game/snake-game.component';
import { AuthnComponent } from './authn/authn.component';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { TestViewComponent } from './test-view/test-view.component';

export const routes: Routes = [
    { path: 'Snake-Game', 
      component: IndexComponent, 
      data: { animation: 'Page' },
      children: [
        { path: 'index', 
          component: AuthnComponent, 
          data: { animation: 'IndexPage' }
        },
        
        { path: 'home', 
          component: ProfileComponent, 
          data: { animation: 'homePage' },
          canActivate: [AuthGuard]
        }
      ]
    },
    { path: 'snake', 
      component: SnakeGameComponent, 
      data: { animation: 'SnakeGamePage' },
      canActivate: [AuthGuard]
    },
    { path: 'test', 
      component: TestViewComponent, 
      data: { animation: 'IndexPage' }
    },
    { path: '', redirectTo: 'Snake-Game/index', pathMatch: 'full' }, // Redirección a index
    { path: '**', redirectTo: 'Snake-Game/index' }  // Redirección por defecto
];
