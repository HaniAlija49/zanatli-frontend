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
          <h1>Welcome to Zanatly</h1>
          <p class="hero-subtitle">Your trusted platform for finding skilled contractors and professionals</p>
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
        <h2>Why Choose Zanatly?</h2>
        <div class="feature-grid">
          <mat-card>
            <mat-icon>search</mat-icon>
            <h3>Smart Search</h3>
            <p>Find the perfect contractor for your specific needs with our intelligent matching system</p>
          </mat-card>

          <mat-card>
            <mat-icon>verified</mat-icon>
            <h3>Verified Professionals</h3>
            <p>Every contractor is thoroughly vetted and verified for your peace of mind</p>
          </mat-card>

          <mat-card>
            <mat-icon>chat</mat-icon>
            <h3>Seamless Communication</h3>
            <p>Connect directly with contractors and discuss your project requirements</p>
          </mat-card>

          <mat-card>
            <mat-icon>security</mat-icon>
            <h3>Secure Platform</h3>
            <p>Your information and transactions are protected with enterprise-grade security</p>
          </mat-card>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who found their perfect contractor on Zanatly</p>
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
      padding: 8rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/assets/pattern.svg') center/cover;
      opacity: 0.1;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .hero h1 {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      font-weight: 800;
      background: linear-gradient(to right, #fff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      line-height: 1.6;
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
      padding: 8rem 2rem;
      background-color: #f8f9fa;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #1a237e;
      font-weight: 700;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    mat-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.05);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    mat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    mat-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      color: #1a237e;
      margin-bottom: 1.25rem;
    }

    mat-card h3 {
      color: #1a237e;
      margin-bottom: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    mat-card p {
      color: #666;
      line-height: 1.5;
      font-size: 1rem;
      margin: 0;
    }

    .cta {
      background: linear-gradient(135deg, #0d47a1 0%, #1a237e 100%);
      color: white;
      padding: 8rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .cta::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/assets/pattern.svg') center/cover;
      opacity: 0.1;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cta h2 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }

    .cta p {
      font-size: 1.3rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .cta button {
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
    }

    @media (max-width: 1200px) {
      .feature-grid {
        grid-template-columns: repeat(2, 1fr);
        max-width: 800px;
      }
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
        max-width: 400px;
      }

      .cta h2 {
        font-size: 2rem;
      }

      .cta p {
        font-size: 1.1rem;
      }
    }
  `]
})
export class LandingComponent {} 