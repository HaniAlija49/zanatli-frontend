import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile } from '../../../core/models/contractor.models';

interface ContractorDashboard {
  id: number;
  fullName: string;
  location: string;
  services: string;
  priceLevel: number;
  jobStats: {
    totalJobs: number;
    pendingJobs: number;
    acceptedJobs: number;
    completedJobs: number;
  };
  reviews: {
    averageRating: number;
    reviewCount: number;
  };
  photoCount: number;
  upcomingJobs: {
    id: number;
    description: string;
    preferredDate: string;
  }[];
}

@Component({
  selector: 'app-contractor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <ng-container *ngIf="!isLoading; else loading">
        <mat-card *ngIf="dashboard">
          <mat-card-header>
            <mat-card-title>Contractor Dashboard</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="welcome-section">
              <h2>Welcome, {{dashboard.fullName}}!</h2>
              <div class="location-price">
                <span class="location">
                  <mat-icon>location_on</mat-icon>
                  {{dashboard.location}}
                </span>
                <span class="price-level">
                  <mat-icon>attach_money</mat-icon>
                  {{'$'.repeat(dashboard.priceLevel)}}
                </span>
              </div>
              <p class="services">Services: {{dashboard.services}}</p>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <h3>Job Statistics</h3>
                <div class="stat-content">
                  <div class="stat-item">
                    <span class="label">Total Jobs</span>
                    <span class="value">{{dashboard.jobStats.totalJobs}}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">Pending</span>
                    <span class="value">{{dashboard.jobStats.pendingJobs}}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">Accepted</span>
                    <span class="value">{{dashboard.jobStats.acceptedJobs}}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">Completed</span>
                    <span class="value">{{dashboard.jobStats.completedJobs}}</span>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <h3>Reviews</h3>
                <div class="stat-content">
                  <div class="stat-item">
                    <span class="label">Average Rating</span>
                    <span class="value rating">
                      <mat-icon>star</mat-icon>
                      {{dashboard.reviews.averageRating.toFixed(1)}}
                    </span>
                  </div>
                  <div class="stat-item">
                    <span class="label">Total Reviews</span>
                    <span class="value">{{dashboard.reviews.reviewCount}}</span>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <h3>Portfolio</h3>
                <div class="stat-content">
                  <div class="stat-item">
                    <span class="label">Photos</span>
                    <span class="value">{{dashboard.photoCount}}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="upcoming-jobs" *ngIf="dashboard.upcomingJobs.length > 0">
              <h3>Upcoming Jobs</h3>
              <div class="jobs-list">
                <div class="job-item" *ngFor="let job of dashboard.upcomingJobs">
                  <div class="job-info">
                    <span class="job-description">{{job.description}}</span>
                    <span class="job-date">{{job.preferredDate | date:'medium'}}</span>
                  </div>
                  <button mat-raised-button color="primary" [routerLink]="['/contractor/jobs', job.id]">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" routerLink="/contractor/jobs">
                View All Jobs
              </button>
              <button mat-raised-button color="accent" routerLink="/contractor/profile">
                Edit Profile
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card *ngIf="!dashboard">
          <mat-card-header>
            <mat-card-title>Complete Your Profile</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Please complete your contractor profile to start receiving job requests.</p>
            <button mat-raised-button color="primary" routerLink="/contractor/profile">
              Create Profile
            </button>
          </mat-card-content>
        </mat-card>
      </ng-container>

      <ng-template #loading>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 2rem;
    }

    .location-price {
      display: flex;
      gap: 1rem;
      margin: 0.5rem 0;
      color: #666;
    }

    .location, .price-level {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .services {
      color: #666;
      margin-top: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .stat-card h3 {
      margin: 0 0 1rem 0;
      color: #1976d2;
    }

    .stat-content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .stat-item .label {
      font-size: 0.9rem;
      color: #666;
    }

    .stat-item .value {
      font-size: 1.2rem;
      font-weight: 500;
      color: #333;
    }

    .stat-item .value.rating {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      color: #ffc107;
    }

    .upcoming-jobs {
      margin-bottom: 2rem;
    }

    .upcoming-jobs h3 {
      margin-bottom: 1rem;
      color: #1976d2;
    }

    .jobs-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .job-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .job-info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .job-description {
      font-weight: 500;
    }

    .job-date {
      font-size: 0.9rem;
      color: #666;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .job-item {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .actions {
        flex-direction: column;
      }

      .actions button {
        width: 100%;
      }
    }
  `]
})
export class ContractorDashboardComponent implements OnInit {
  dashboard: ContractorDashboard | null = null;
  isLoading = true;

  constructor(private contractorService: ContractorService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.contractorService.getDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
        this.dashboard = null;
      }
    });
  }
} 