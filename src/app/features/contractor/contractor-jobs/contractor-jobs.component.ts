import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job, JobStatus } from '../../../core/models/job.models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DeclineDialogComponent } from '../../../shared/components/decline-dialog/decline-dialog.component';
import { ContractorJobDetailsDialogComponent } from './contractor-job-details-dialog.component';

@Component({
  selector: 'app-contractor-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ConfirmDialogComponent,
    DeclineDialogComponent,
    ContractorJobDetailsDialogComponent
  ],
  template: `
    <div class="jobs-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Jobs</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <!-- Responsive Table for Desktop, Cards for Mobile -->
          <ng-container *ngIf="!isLoading">
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
                <td mat-cell *matCellDef="let job">
                  <span [ngClass]="'status-' + ((statusMap[job.status] || job.status) + '').toLowerCase()">
                    {{ statusMap[job.status] || job.status }}
                  </span>
                </td>
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
                  <ng-container [ngSwitch]="job.status">
                    <button *ngSwitchCase="0" mat-icon-button color="primary" 
                            (click)="acceptJob(job)" [disabled]="isActionLoading">
                      <mat-icon>check</mat-icon>
                    </button>
                    <button *ngSwitchCase="0" mat-icon-button color="warn" 
                            (click)="openDeclineDialog(job)" [disabled]="isActionLoading">
                      <mat-icon>close</mat-icon>
                    </button>
                    <button *ngSwitchCase="1" mat-icon-button color="accent" 
                            (click)="completeJob(job)" [disabled]="isActionLoading">
                      <mat-icon>done_all</mat-icon>
                    </button>
                  </ng-container>
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
                  <span class="job-card-status" [ngClass]="'status-' + ((statusMap[job.status] || job.status) + '').toLowerCase()">
                    {{ statusMap[job.status] || job.status }}
                  </span>
                </div>
                <div class="job-card-row"><b>Preferred Date:</b> {{job.preferredDate | date}}</div>
                <div class="job-card-actions">
                  <button mat-icon-button color="primary" (click)="openJobDetailsDialog(job)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <ng-container [ngSwitch]="job.status">
                    <button *ngSwitchCase="0" mat-icon-button color="primary" 
                            (click)="acceptJob(job)" [disabled]="isActionLoading">
                      <mat-icon>check</mat-icon>
                    </button>
                    <button *ngSwitchCase="0" mat-icon-button color="warn" 
                            (click)="openDeclineDialog(job)" [disabled]="isActionLoading">
                      <mat-icon>close</mat-icon>
                    </button>
                    <button *ngSwitchCase="1" mat-icon-button color="accent" 
                            (click)="completeJob(job)" [disabled]="isActionLoading">
                      <mat-icon>done_all</mat-icon>
                    </button>
                  </ng-container>
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
  styles: [`
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
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .no-jobs {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .status-pending {
      color: #f57c00;
      font-weight: 500;
    }
    .status-accepted {
      color: #2196f3;
      font-weight: 500;
    }
    .status-declined {
      color: #f44336;
      font-weight: 500;
    }
    .status-completed {
      color: #4caf50;
      font-weight: 500;
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
  `]
})
export class ContractorJobsComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];
  isLoading = false;
  isActionLoading = false;
  statusMap: Record<string | number, string> = {
    0: 'Pending',
    1: 'Accepted',
    2: 'Declined',
    3: 'Completed',
    'Pending': 'Pending',
    'Accepted': 'Accepted',
    'Declined': 'Declined',
    'Completed': 'Completed'
  };
  isMobile = false;

  constructor(
    private jobService: JobService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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
    this.isLoading = true;
    this.jobService.getContractorJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.snackBar.open('Error loading jobs. Please try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  acceptJob(job: Job) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Accept Job',
        message: 'Are you sure you want to accept this job?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isActionLoading = true;
        this.jobService.acceptJob(job.id).subscribe({
          next: () => {
            this.snackBar.open('Job accepted successfully!', 'Close', { duration: 5000 });
            this.loadJobs();
            this.isActionLoading = false;
          },
          error: (error) => {
            console.error('Error accepting job:', error);
            this.snackBar.open('Error accepting job. Please try again.', 'Close', { duration: 5000 });
            this.isActionLoading = false;
          }
        });
      }
    });
  }

  openDeclineDialog(job: Job) {
    const dialogRef = this.dialog.open(DeclineDialogComponent, {
      width: '400px',
      data: {
        title: 'Decline Job',
        message: 'Please provide a reason for declining this job:'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isActionLoading = true;
        this.jobService.declineJob(job.id, result).subscribe({
          next: () => {
            this.snackBar.open('Job declined successfully!', 'Close', { duration: 5000 });
            this.loadJobs();
            this.isActionLoading = false;
          },
          error: (error) => {
            console.error('Error declining job:', error);
            this.snackBar.open('Error declining job. Please try again.', 'Close', { duration: 5000 });
            this.isActionLoading = false;
          }
        });
      }
    });
  }

  completeJob(job: Job) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Complete Job',
        message: 'Are you sure you want to mark this job as complete?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isActionLoading = true;
        this.jobService.completeJob(job.id).subscribe({
          next: () => {
            this.snackBar.open('Job marked as complete!', 'Close', { duration: 5000 });
            this.loadJobs();
            this.isActionLoading = false;
          },
          error: (error) => {
            console.error('Error completing job:', error);
            this.snackBar.open('Error completing job. Please try again.', 'Close', { duration: 5000 });
            this.isActionLoading = false;
          }
        });
      }
    });
  }

  openJobDetailsDialog(job: Job) {
    const dialogRef = this.dialog.open(ContractorJobDetailsDialogComponent, {
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