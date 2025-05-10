import { Component, OnInit } from '@angular/core';
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
    JobDetailsDialogComponent
  ],
  template: `
    <div class="jobs-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Jobs</mat-card-title>
          <button mat-raised-button color="primary" (click)="openCreateJobDialog()">Create New Job</button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="jobs" class="mat-elevation-z8">
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
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class ClientJobsComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];

  constructor(private jobService: JobService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadJobs();
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