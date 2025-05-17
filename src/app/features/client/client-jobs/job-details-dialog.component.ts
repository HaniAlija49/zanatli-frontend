import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { JobService } from '../../../core/services/job.service';
import { Job, JobStatus } from '../../../core/models/job.models';
import { JobReviewFormComponent } from '../../../jobs/job-review-form/job-review-form.component';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.models';

@Component({
  selector: 'app-job-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatCardModule,
    JobReviewFormComponent
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
            <div class="row"><span class="label"><mat-icon>fingerprint</mat-icon> Job ID:</span> <span>{{ job.id }}</span></div>
            <div class="row"><span class="label"><mat-icon>description</mat-icon> Description:</span> <span>{{ job.description || '—' }}</span></div>
            <div class="row"><span class="label"><mat-icon>flag</mat-icon> Status:</span> <mat-chip [ngClass]="getStatusClass(job.status)">{{ getStatusText(job.status) }}</mat-chip></div>
            <div class="row" *ngIf="job.responseMessage"><span class="label"><mat-icon>message</mat-icon> Response:</span> <span class="response-message">{{ job.responseMessage }}</span></div>
            <div class="row"><span class="label"><mat-icon>event</mat-icon> Preferred Date:</span> <span>{{ job.preferredDate ? (job.preferredDate | date:'mediumDate') : '—' }}</span></div>
            <div class="row" *ngIf="job.createdAt"><span class="label"><mat-icon>calendar_today</mat-icon> Created At:</span> <span>{{ job.createdAt | date:'medium' }}</span></div>
            <div class="row" *ngIf="job.updatedAt"><span class="label"><mat-icon>update</mat-icon> Updated At:</span> <span>{{ job.updatedAt | date:'medium' }}</span></div>
            <mat-divider></mat-divider>
            <div class="row"><span class="label"><mat-icon>person</mat-icon> Contractor:</span>
              <span>
                <div *ngIf="job.contractor">
                  <div><b>ID:</b> {{ job.contractor.id }}</div>
                  <div><b>Email:</b> {{ job.contractor.email }}</div>
                </div>
                <div *ngIf="!job.contractor">—</div>
              </span>
            </div>
            <mat-divider *ngIf="isJobCompleted(job)"></mat-divider>
            <!-- Review Section -->
            <div *ngIf="isJobCompleted(job)">
              <ng-container *ngIf="reviewLoading">
                <p>Loading review...</p>
              </ng-container>
              <ng-container *ngIf="!reviewLoading">
                <ng-container *ngIf="review && review.id; else showReviewButton">
                  <mat-card class="review-card">
                    <mat-card-title>Your Review</mat-card-title>
                    <mat-card-content class="starts-container">
                      <div class="review-stars">
                        <mat-icon *ngFor="let star of stars; let i = index" [ngClass]="{'filled': i < review.rating}">
                          {{ i < review.rating ? 'star' : 'star_border' }}
                        </mat-icon>
                      </div>
                      <div *ngIf="review.comment" class="review-comment">{{ review.comment }}</div>
                      <div class="review-date"><small>Submitted: {{ review.createdAt | date:'short' }}</small></div>
                    </mat-card-content>
                  </mat-card>
                </ng-container>
                <ng-template #showReviewButton>
                  <button mat-raised-button color="primary" (click)="showReviewForm = true" *ngIf="!showReviewForm">Leave Review</button>
                  <app-job-review-form *ngIf="showReviewForm" [jobId]="toNumber(job.id)" (ngSubmit)="onReviewSubmitted()"></app-job-review-form>
                  <div *ngIf="reviewError" style="color: #f44336; margin-top: 0.5rem;">Could not load review. You can still leave a review.</div>
                </ng-template>
              </ng-container>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="close()">Close</button>
        <button mat-stroked-button color="accent" (click)="markComplete()" *ngIf="!isJobCompleted(job)">Mark as Complete</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `.dialog-container { padding: 0; max-width: 480px; min-width: 320px; }
    .dialog-title { display: flex; align-items: center; font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
    .title-icon { margin-right: 8px; color: #1976d2; }
    mat-card.job-card { margin: 0; box-shadow: none; border-radius: 12px; background: #fafbfc; border: 1px solid #e0e0e0; }
    mat-card-content { display: flex; flex-direction: column; gap: 18px; padding: 12px 0 0 0; }
    .row { display: flex; align-items: center; gap: 10px; font-size: 15px; padding: 2px 0; }
    .label { min-width: 130px; font-weight: 500; color: #444; display: flex; align-items: center; gap: 4px; }
    .response-message { 
      color: #d32f2f;
      font-style: italic;
      background: #ffebee;
      padding: 8px 12px;
      border-radius: 4px;
      border-left: 3px solid #d32f2f;
    }
    mat-chip { font-size: 14px; padding: 4px 12px; font-weight: 500; }
    .status-pending { background-color: #fff3e0; color: #f57c00; }
    .status-accepted { background-color: #e3f2fd; color: #2196f3; }
    .status-declined { background-color: #ffebee; color: #f44336; }
    .status-completed { background-color: #e8f5e9; color: #4caf50; }
    .review-card { margin-top: 1rem; background: #fffde7; border: 1px solid #ffe082; border-radius: 10px; }
    .review-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 0.5rem;
  width: 100%;
  height: auto; /* or specify an appropriate height like 24px */
}
    .review-stars mat-icon { color: #FFD600; font-size: 24px; }
    .review-stars mat-icon:not(.filled) { color: #ccc; }
    .review-comment { margin-bottom: 0.5rem; color: #444; font-size: 1.08rem; }
    .review-date { color: #888; font-size: 0.95em; }
    mat-dialog-actions { margin-top: 16px; padding: 0 16px 16px 0; }
  `]
})
export class JobDetailsDialogComponent implements OnInit {
  job: Job;
  jobStatus = JobStatus;
  review: Review | null = null;
  reviewLoading = false;
  showReviewForm = false;
  reviewError = false;
  stars = [1, 2, 3, 4, 5];
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
    @Inject(MAT_DIALOG_DATA) public data: { job: Job },
    private dialogRef: MatDialogRef<JobDetailsDialogComponent>,
    private jobService: JobService,
    private reviewService: ReviewService
  ) {
    this.job = data.job;
  }

  ngOnInit() {
    if (this.isJobCompleted(this.job)) {
      this.fetchReview();
    }
  }

  fetchReview() {
    this.reviewLoading = true;
    this.reviewError = false;
    this.reviewService.getReviewForJob(this.toNumber(this.job.id)).subscribe({
      next: (review) => {
        if (review && review.id) {
          this.review = review;
        } else {
          this.review = null;
        }
        this.reviewLoading = false;
      },
      error: (err) => {
        this.review = null;
        this.reviewLoading = false;
        this.reviewError = true;
      }
    });
  }

  onReviewSubmitted() {
    this.fetchReview();
    this.showReviewForm = false;
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

  toNumber(val: any): number {
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }

  isJobCompleted(job: any): boolean {
    return job.status === 3 || job.status === 'Completed';
  }

  getStatusClass(status: number | string): string {
    const statusStr = (this.statusMap[status] || status).toString().toLowerCase();
    return `status-${statusStr}`;
  }

  getStatusText(status: number | string): string {
    return this.statusMap[status] || status.toString();
  }
} 