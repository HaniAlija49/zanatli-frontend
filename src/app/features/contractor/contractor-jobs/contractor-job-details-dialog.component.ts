import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { JobDetails } from '../../../core/models/job-details.models';
import { JobPhotosComponent } from '../../../components/job-photos/job-photos.component';

@Component({
  selector: 'app-contractor-job-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatCardModule,
    JobPhotosComponent
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="title-icon">work_outline</mat-icon>
        Job Details
      </h2>
      <mat-dialog-content>
        <mat-card class="job-card">
          <mat-card-content>
            <div class="row"><span class="label"><mat-icon>fingerprint</mat-icon> Job ID:</span> <span>{{ data.job.id }}</span></div>
            <div class="row"><span class="label"><mat-icon>description</mat-icon> Description:</span> <span>{{ data.job.description || '—' }}</span></div>
            <div class="row"><span class="label"><mat-icon>flag</mat-icon> Status:</span> <mat-chip [ngClass]="'status-' + ((statusMap[data.job.status] || data.job.status) + '').toLowerCase()">{{ statusMap[data.job.status] || data.job.status }}</mat-chip></div>
            <div class="row"><span class="label"><mat-icon>event</mat-icon> Preferred Date:</span> <span>{{ data.job.preferredDate ? (data.job.preferredDate | date:'mediumDate') : '—' }}</span></div>
            <div class="row" *ngIf="data.job.createdAt"><span class="label"><mat-icon>calendar_today</mat-icon> Created At:</span> <span>{{ data.job.createdAt | date:'medium' }}</span></div>
            <div class="row" *ngIf="data.job.updatedAt"><span class="label"><mat-icon>update</mat-icon> Updated At:</span> <span>{{ data.job.updatedAt | date:'medium' }}</span></div>
            <mat-divider></mat-divider>
            <div class="row"><span class="label"><mat-icon>person</mat-icon> Client:</span>
              <span>
                <div *ngIf="data.job.client">
                  <div><b>ID:</b> {{ data.job.client.id }}</div>
                  <div *ngIf="data.job.client.fullName"><b>Name:</b> {{ data.job.client.fullName }}</div>
                  <div *ngIf="data.job.client.email"><b>Email:</b> {{ data.job.client.email }}</div>
                  <div *ngIf="data.job.client.phone"><b>Phone:</b> {{ data.job.client.phone }}</div>
                </div>
                <div *ngIf="!data.job.client">—</div>
              </span>
            </div>
            <div class="row"><span class="label"><mat-icon>engineering</mat-icon> Contractor:</span>
              <span>
                <div *ngIf="data.job.contractor">
                  <div><b>ID:</b> {{ data.job.contractor.id }}</div>
                  <div *ngIf="data.job.contractor.fullName"><b>Name:</b> {{ data.job.contractor.fullName }}</div>
                  <div *ngIf="data.job.contractor.email"><b>Email:</b> {{ data.job.contractor.email }}</div>
                  <div *ngIf="data.job.contractor.phone"><b>Phone:</b> {{ data.job.contractor.phone }}</div>
                </div>
                <div *ngIf="!data.job.contractor">—</div>
              </span>
            </div>
            <mat-divider></mat-divider>
            <!-- Photos Section -->
            <div class="photos-section">
              <h3 class="section-title">
                <mat-icon>photo_library</mat-icon>
                Photos
              </h3>
              <app-job-photos [jobId]="data.job.id.toString()"></app-job-photos>
            </div>
            <mat-divider *ngIf="data.job.declineReason || data.job.responseMessage"></mat-divider>
            <div class="row" *ngIf="data.job.declineReason"><span class="label"><mat-icon>highlight_off</mat-icon> Decline Reason:</span> <span>{{ data.job.declineReason }}</span></div>
            <div class="row" *ngIf="data.job.responseMessage"><span class="label"><mat-icon>message</mat-icon> Response Message:</span> <span>{{ data.job.responseMessage }}</span></div>
          </mat-card-content>
        </mat-card>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="onClose()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 0; max-width: 480px; min-width: 320px; }
    .dialog-title { display: flex; align-items: center; font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
    .title-icon { margin-right: 8px; color: #1976d2; }
    mat-card.job-card { margin: 0; box-shadow: none; border-radius: 12px; background: #fafbfc; border: 1px solid #e0e0e0; }
    mat-card-content { display: flex; flex-direction: column; gap: 18px; padding: 12px 0 0 0; }
    .row { display: flex; align-items: center; gap: 10px; font-size: 15px; padding: 2px 0; }
    .label { min-width: 130px; font-weight: 500; color: #444; display: flex; align-items: center; gap: 4px; }
    mat-chip { font-size: 14px; padding: 4px 12px; font-weight: 500; }
    .status-pending { background-color: #fff3e0; color: #f57c00; }
    .status-accepted { background-color: #e3f2fd; color: #2196f3; }
    .status-declined { background-color: #ffebee; color: #f44336; }
    .status-completed { background-color: #e8f5e9; color: #4caf50; }
    mat-dialog-actions { margin-top: 16px; padding: 0 16px 16px 0; }
    .photos-section {
      margin-top: 1rem;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      color: #444;
      margin-bottom: 1rem;
    }
    .section-title mat-icon {
      color: #1976d2;
    }
  `]
})
export class ContractorJobDetailsDialogComponent {
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

  constructor(
    public dialogRef: MatDialogRef<ContractorJobDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { job: JobDetails }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
} 