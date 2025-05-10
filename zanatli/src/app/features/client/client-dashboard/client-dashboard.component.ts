import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Client Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Welcome to your client dashboard!</p>
          <div class="actions">
            <button mat-raised-button color="primary" routerLink="/client/jobs">
              View My Jobs
            </button>
            <button mat-raised-button color="accent" routerLink="/contractors">
              Find Contractors
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class ClientDashboardComponent {} 