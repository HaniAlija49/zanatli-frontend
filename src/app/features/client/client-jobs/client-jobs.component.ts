import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.models';
import { JobCreateDialogComponent } from './job-create-dialog.component';
import { JobDetailsDialogComponent } from './job-details-dialog.component';

@Component({
  selector: 'app-client-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    JobCreateDialogComponent,
  ],
  template: `
    <div class="jobs-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Jobs</mat-card-title>
          <button mat-raised-button color="primary" (click)="openCreateJobDialog()">Create New Job</button>
        </mat-card-header>
        <mat-card-content>
          <!-- Responsive Table for Desktop, Cards for Mobile -->
          <ng-container>
            <table mat-table [dataSource]="jobs" class="mat-elevation-z8 jobs-table" *ngIf="!isMobile">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let job">{{job.id}}</td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let job">{{job.description}}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let job">{{job.status}}</td>
              </ng-container>
              <ng-container matColumnDef="preferredDate">
                <th mat-header-cell *matHeaderCellDef>Preferred Date</th>
                <td mat-cell *matCellDef="let job">{{job.preferredDate | date}}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let job">
                  <button mat-icon-button color="primary" (click)="openJobDetailsDialog(job)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- Card layout for mobile -->
            <div class="job-card-list" *ngIf="isMobile">
              <mat-card class="job-card" *ngFor="let job of jobs">
                <div class="job-card-header">
                  <div class="job-card-title">#{{job.id}} - {{job.description}}</div>
                  <span class="job-card-status">{{ job.status }}</span>
                </div>
                <div class="job-card-row"><b>Preferred Date:</b> {{job.preferredDate | date}}</div>
                <div class="job-card-actions">
                  <button mat-icon-button color="primary" (click)="openJobDetailsDialog(job)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </div>
              </mat-card>
            </div>

            <div *ngIf="jobs.length === 0" class="no-jobs">
              <p>No jobs found.</p>
            </div>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .jobs-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .jobs-table {
      width: 100%;
    }
    .job-card-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .job-card {
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      background: #fff;
    }
    .job-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .job-card-title {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .job-card-status {
      font-size: 0.95rem;
      font-weight: 500;
    }
    .job-card-row {
      margin-bottom: 0.5rem;
    }
    .job-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .no-jobs {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    @media (max-width: 800px) {
      .jobs-container {
        padding: 0.5rem;
      }
      .jobs-table {
        display: none;
      }
      .job-card-list {
        display: flex;
      }
    }
    @media (min-width: 801px) {
      .job-card-list {
        display: none;
      }
    }
  `
  ]
})
export class ClientJobsComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];
  isMobile: boolean = false;

  constructor(private jobService: JobService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadJobs();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 800;
  }

  loadJobs() {
    this.jobService.getClientJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
      }
    });
  }

  openCreateJobDialog() {
    const dialogRef = this.dialog.open(JobCreateDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.loadJobs();
      }
    });
  }

  openJobDetailsDialog(job: Job) {
    const dialogRef = this.dialog.open(JobDetailsDialogComponent, {
      width: '500px',
      data: { job }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadJobs();
      }
    });
  }
} 