import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ],
  template: `
    <div class="app">
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/contractors">Contractors</a>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    nav {
      padding: 1rem;
      background: #f5f5f5;
    }
    nav a {
      margin-right: 1rem;
      text-decoration: none;
      color: #333;
    }
    main {
      flex: 1;
    }
  `]
})
export class AppComponent {
  title = 'zanatli';
}
