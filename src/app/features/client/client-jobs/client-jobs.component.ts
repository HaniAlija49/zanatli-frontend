import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.models';

@Component({
  selector: 'app-client-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
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
                <button mat-icon-button color="primary" (click)="viewJob(job)">
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
  `]
})
export class ClientJobsComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];

  constructor(private jobService: JobService) {}

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

  viewJob(job: Job) {
    // TODO: Implement job details view
    console.log('View job:', job);
  }
} 