import { Component, OnInit } from '@angular/core';
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
    DeclineDialogComponent
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

          <table *ngIf="!isLoading" mat-table [dataSource]="jobs" class="mat-elevation-z8">
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
                <span [ngClass]="'status-' + job.status.toLowerCase()">
                  {{job.status}}
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
                <ng-container [ngSwitch]="job.status">
                  <button *ngSwitchCase="'Pending'" mat-icon-button color="primary" 
                          (click)="confirmAction('accept', job)" [disabled]="isActionLoading">
                    <mat-icon>check</mat-icon>
                  </button>
                  <button *ngSwitchCase="'Pending'" mat-icon-button color="warn" 
                          (click)="openDeclineDialog(job)" [disabled]="isActionLoading">
                    <mat-icon>close</mat-icon>
                  </button>
                  <button *ngSwitchCase="'Accepted'" mat-icon-button color="accent" 
                          (click)="confirmAction('complete', job)" [disabled]="isActionLoading">
                    <mat-icon>done_all</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="!isLoading && jobs.length === 0" class="no-jobs">
            <p>No jobs found.</p>
          </div>
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
    table {
      width: 100%;
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
  `]
})
export class ContractorJobsComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];
  isLoading = false;
  isActionLoading = false;

  constructor(
    private jobService: JobService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadJobs();
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

  confirmAction(action: 'accept' | 'complete', job: Job) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: action === 'accept' ? 'Accept Job' : 'Complete Job',
        message: action === 'accept' 
          ? 'Are you sure you want to accept this job?'
          : 'Are you sure you want to mark this job as complete?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'accept') {
          this.acceptJob(job);
        } else {
          this.completeJob(job);
        }
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
        this.declineJob(job.id, result);
      }
    });
  }

  acceptJob(job: Job) {
    this.isActionLoading = true;
    this.jobService.acceptJob(job.id).subscribe({
      next: () => {
        this.snackBar.open('Job accepted successfully!', 'Close', {
          duration: 5000
        });
        this.loadJobs();
        this.isActionLoading = false;
      },
      error: (error) => {
        console.error('Error accepting job:', error);
        this.snackBar.open('Error accepting job. Please try again.', 'Close', {
          duration: 5000
        });
        this.isActionLoading = false;
      }
    });
  }

  declineJob(jobId: string, reason: string) {
    this.isActionLoading = true;
    this.jobService.declineJob(jobId, reason).subscribe({
      next: () => {
        this.snackBar.open('Job declined successfully!', 'Close', {
          duration: 5000
        });
        this.loadJobs();
        this.isActionLoading = false;
      },
      error: (error) => {
        console.error('Error declining job:', error);
        this.snackBar.open('Error declining job. Please try again.', 'Close', {
          duration: 5000
        });
        this.isActionLoading = false;
      }
    });
  }

  completeJob(job: Job) {
    this.isActionLoading = true;
    this.jobService.completeJob(job.id).subscribe({
      next: () => {
        this.snackBar.open('Job marked as complete!', 'Close', {
          duration: 5000
        });
        this.loadJobs();
        this.isActionLoading = false;
      },
      error: (error) => {
        console.error('Error completing job:', error);
        this.snackBar.open('Error completing job. Please try again.', 'Close', {
          duration: 5000
        });
        this.isActionLoading = false;
      }
    });
  }
} 