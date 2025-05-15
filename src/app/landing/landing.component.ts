import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Find Trusted Local Contractors</h1>
          <p class="hero-subtitle">Connect with skilled professionals for all your home and business needs</p>
          <div class="cta-buttons">
            <a routerLink="/jobs" class="btn btn-primary">Find a Contractor</a>
            <a routerLink="/contractors/register" class="btn btn-secondary">Become a Contractor</a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2>Why Choose Zanatli?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find the perfect contractor for your specific needs with our advanced search system</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>Verified Reviews</h3>
            <p>Read authentic reviews from real customers to make informed decisions</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Direct Communication</h3>
            <p>Connect directly with contractors and discuss your project requirements</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Secure Platform</h3>
            <p>Your information and transactions are protected with our secure system</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who found their perfect contractor on Zanatli</p>
          <a routerLink="/jobs" class="btn btn-primary">Start Your Search</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing {
      width: 100%;
      overflow-x: hidden;
      min-height: 100vh;
      background-color: #f5f5f5;
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

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #ff4081;
      color: white;
    }

    .btn-primary:hover {
      background-color: #f50057;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background-color: transparent;
      color: white; !important
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .btn-secondary{
    color: #fff;
    }
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #1a237e;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .cta-section {
      background: linear-gradient(135deg, #0d47a1 0%, #1a237e 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
      margin-bottom: 0;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    .cta-section p {
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

      .cta-buttons {
        flex-direction: column;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent {} 