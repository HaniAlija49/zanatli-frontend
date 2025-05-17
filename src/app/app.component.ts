import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavComponent } from './core/components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavComponent
  ],
  template: `
    <app-nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </app-nav>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
    
    main {
      height: 100%;
    }
  `]
})
export class AppComponent {}
