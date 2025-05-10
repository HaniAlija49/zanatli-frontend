import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile } from '../../../core/models/contractor.models';

@Component({
  selector: 'app-contractor-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <mat-card *ngIf="profile">
        <mat-card-header>
          <mat-card-title>Contractor Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h2>Welcome, {{profile.fullName}}!</h2>
          <p>Company: {{profile.companyName}}</p>
          <p>Location: {{profile.location}}</p>
          <p>Services: {{profile.services.join(', ')}}</p>
          
          <div class="actions">
            <button mat-raised-button color="primary" routerLink="/contractor/jobs">
              View My Jobs
            </button>
            <button mat-raised-button color="accent" routerLink="/contractor/profile">
              Edit Profile
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="!profile">
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
export class ContractorDashboardComponent implements OnInit {
  profile: ContractorProfile | null = null;

  constructor(private contractorService: ContractorService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.contractorService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }
} 