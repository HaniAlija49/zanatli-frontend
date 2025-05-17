import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientService, ClientDashboard } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-dashboard',
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
            <mat-card-title>Client Dashboard</mat-card-title>
          </mat-card-header>
          <mat-card-content>
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
            </div>

            <div class="reviewable-jobs" *ngIf="dashboard.reviewableJobs.length > 0">
              <h3>Jobs Ready for Review</h3>
              <div class="jobs-list">
                <div class="job-item" *ngFor="let job of dashboard.reviewableJobs">
                  <div class="job-info">
                    <span class="job-description">{{job.description}}</span>
                    <div class="job-details">
                      <span class="contractor-name">
                        <mat-icon>person</mat-icon>
                        {{job.contractorName}}
                      </span>
                      <span class="job-date">
                        <mat-icon>event</mat-icon>
                        {{job.preferredDate | date:'medium'}}
                      </span>
                    </div>
                  </div>
                  <button mat-raised-button color="primary" [routerLink]="['/client/jobs', job.id]">
                    Review Job
                  </button>
                </div>
              </div>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" routerLink="/client/jobs">
                View All Jobs
              </button>
              <button mat-raised-button color="accent" routerLink="/contractors">
                Find Contractors
              </button>
            </div>
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

    .reviewable-jobs {
      margin-bottom: 2rem;
    }

    .reviewable-jobs h3 {
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
      gap: 0.5rem;
    }

    .job-description {
      font-weight: 500;
    }

    .job-details {
      display: flex;
      gap: 1rem;
      color: #666;
      font-size: 0.9rem;
    }

    .contractor-name, .job-date {
      display: flex;
      align-items: center;
      gap: 0.3rem;
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

      .job-details {
        flex-direction: column;
        gap: 0.5rem;
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
export class ClientDashboardComponent implements OnInit {
  dashboard: ClientDashboard | null = null;
  isLoading = true;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.clientService.getDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
      }
    });
  }
} 