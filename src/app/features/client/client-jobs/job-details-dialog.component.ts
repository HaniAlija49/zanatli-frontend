import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobService } from '../../../core/services/job.service';
import { Job, JobStatus } from '../../../core/models/job.models';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-details-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Job Details</h2>
    <div mat-dialog-content>
      <p><strong>ID:</strong> {{job.id}}</p>
      <p><strong>Description:</strong> {{job.description}}</p>
      <p><strong>Status:</strong> {{job.status}}</p>
      <p><strong>Preferred Date:</strong> {{job.preferredDate | date}}</p>
      <p><strong>Created At:</strong> {{job.createdAt | date:'short'}}</p>
      <p><strong>Updated At:</strong> {{job.updatedAt | date:'short'}}</p>
      <p><strong>Contractor:</strong> {{job.contractor?.fullName || job.contractorId}}</p>
    </div>
    <div mat-dialog-actions class="actions">
      <button mat-button (click)="close()">Close</button>
      <button mat-raised-button color="primary" (click)="markComplete()" *ngIf="job.status !== jobStatus.Completed">Mark as Complete</button>
    </div>
  `,
  styles: [`
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
  `]
})
export class JobDetailsDialogComponent {
  job: Job;
  jobStatus = JobStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { job: Job },
    private dialogRef: MatDialogRef<JobDetailsDialogComponent>,
    private jobService: JobService
  ) {
    this.job = data.job;
  }

  markComplete() {
    this.jobService.completeJob(this.job.id).subscribe({
      next: () => this.dialogRef.close('updated'),
      error: (err) => alert('Failed to mark job as complete: ' + (err?.error?.message || err.message || err))
    });
  }

  close() {
    this.dialogRef.close();
  }
} 