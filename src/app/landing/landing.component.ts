import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="landing">
      <h1>Welcome to Zanatli</h1>
      <p>Find local contractors for your needs</p>
    </div>
  `,
  styles: [`
    .landing {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class LandingComponent {} 