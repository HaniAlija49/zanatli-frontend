import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Find Trusted Local Contractors</h1>
          <p class="hero-subtitle">Connect with skilled professionals for all your home and business needs</p>
          <div class="hero-buttons">
            <button mat-raised-button color="primary" routerLink="/contractors">
              Find a Contractor
            </button>
            <button mat-stroked-button color="accent" routerLink="/auth/register">
              Become a Contractor
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2>Why Choose Zanatli?</h2>
        <div class="feature-grid">
          <mat-card>
            <mat-icon>search</mat-icon>
            <h3>Easy Search</h3>
            <p>Find the perfect contractor for your specific needs with our advanced search system</p>
          </mat-card>

          <mat-card>
            <mat-icon>verified</mat-icon>
            <h3>Verified Reviews</h3>
            <p>Read authentic reviews from real customers to make informed decisions</p>
          </mat-card>

          <mat-card>
            <mat-icon>chat</mat-icon>
            <h3>Direct Communication</h3>
            <p>Connect directly with contractors and discuss your project requirements</p>
          </mat-card>

          <mat-card>
            <mat-icon>security</mat-icon>
            <h3>Secure Platform</h3>
            <p>Your information and transactions are protected with our secure system</p>
          </mat-card>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who found their perfect contractor on Zanatli</p>
          <button mat-raised-button color="primary" routerLink="/contractors">
            Start Your Search
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-container {
      width: 100%;
      overflow-x: hidden;
    }

    .hero {
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .hero-buttons button[mat-stroked-button] {
      color: white;
      border-color: white;
    }

    .hero-buttons button[mat-stroked-button]:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .features {
      padding: 6rem 2rem;
      background-color: #f5f5f5;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #1a237e;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    mat-card:hover {
      transform: translateY(-5px);
    }

    mat-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      color: #1a237e;
      margin-bottom: 1rem;
    }

    mat-card h3 {
      color: #1a237e;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    mat-card p {
      color: #666;
      line-height: 1.6;
    }

    .cta {
      background: linear-gradient(135deg, #0d47a1 0%, #1a237e 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    .cta p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent {} 