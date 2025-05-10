import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.models';

@Component({
  selector: 'app-contractor-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="jobs-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Jobs</mat-card-title>
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
                <ng-container [ngSwitch]="job.status">
                  <button *ngSwitchCase="'Pending'" mat-icon-button color="primary" (click)="acceptJob(job)">
                    <mat-icon>check</mat-icon>
                  </button>
                  <button *ngSwitchCase="'Pending'" mat-icon-button color="warn" (click)="declineJob(job)">
                    <mat-icon>close</mat-icon>
                  </button>
                  <button *ngSwitchCase="'Accepted'" mat-icon-button color="accent" (click)="completeJob(job)">
                    <mat-icon>done_all</mat-icon>
                  </button>
                </ng-container>
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
  `]
})
export class ContractorJobsComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];

  constructor(
    private jobService: JobService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getContractorJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
      }
    });
  }

  acceptJob(job: Job) {
    this.jobService.acceptJob(job.id).subscribe({
      next: () => {
        this.loadJobs();
      },
      error: (error) => {
        console.error('Error accepting job:', error);
      }
    });
  }

  declineJob(job: Job) {
    // TODO: Implement decline dialog with reason
    this.jobService.declineJob(job.id, 'Declined by contractor').subscribe({
      next: () => {
        this.loadJobs();
      },
      error: (error) => {
        console.error('Error declining job:', error);
      }
    });
  }

  completeJob(job: Job) {
    this.jobService.completeJob(job.id).subscribe({
      next: () => {
        this.loadJobs();
      },
      error: (error) => {
        console.error('Error completing job:', error);
      }
    });
  }
} 