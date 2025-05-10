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
          <h1>Find the Perfect Contractor for Your Project</h1>
          <p>Connect with skilled professionals and get your work done efficiently</p>
          <div class="hero-buttons">
            <button mat-raised-button color="primary" routerLink="/auth/register">
              Get Started
            </button>
            <button mat-stroked-button color="primary" routerLink="/contractors">
              Browse Contractors
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
            <h3>Find Contractors</h3>
            <p>Browse through verified contractors in your area</p>
          </mat-card>

          <mat-card>
            <mat-icon>verified_user</mat-icon>
            <h3>Verified Profiles</h3>
            <p>All contractors are verified and reviewed</p>
          </mat-card>

          <mat-card>
            <mat-icon>chat</mat-icon>
            <h3>Easy Communication</h3>
            <p>Direct messaging with contractors</p>
          </mat-card>

          <mat-card>
            <mat-icon>payments</mat-icon>
            <h3>Secure Payments</h3>
            <p>Safe and secure payment processing</p>
          </mat-card>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers and contractors</p>
        <button mat-raised-button color="primary" routerLink="/auth/register">
          Sign Up Now
        </button>
      </section>
    </div>
  `,
  styles: [`
    .landing-container {
      max-width: 100%;
      overflow-x: hidden;
    }

    .hero {
      background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .features {
      padding: 4rem 2rem;
      background: #f5f5f5;
    }

    .features h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card {
      text-align: center;
      padding: 2rem;
    }

    mat-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      color: #1976d2;
      margin-bottom: 1rem;
    }

    mat-card h3 {
      margin: 1rem 0;
      font-size: 1.5rem;
    }

    .cta {
      text-align: center;
      padding: 4rem 2rem;
      background: #fff;
    }

    .cta h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .cta p {
      margin-bottom: 2rem;
      color: #666;
    }

    @media (max-width: 600px) {
      .hero h1 {
        font-size: 2rem;
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