import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ReviewService } from '../../core/services/review.service';
import { CreateReviewDto } from '../../core/models/review.models';

@Component({
  selector: 'app-job-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-title>Leave a Review</mat-card-title>
      <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
        <div class="star-rating">
          <mat-icon *ngFor="let star of stars; let i = index"
                    (click)="setRating(i + 1)"
                    [ngClass]="{'filled': i < reviewForm.get('rating')?.value}">
            {{ i < reviewForm.get('rating')?.value ? 'star' : 'star_border' }}
          </mat-icon>
        </div>
        <mat-error *ngIf="reviewForm.get('rating')?.hasError('required')">Rating is required</mat-error>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Comment</mat-label>
          <textarea matInput formControlName="comment" rows="3"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="reviewForm.invalid">Submit Review</button>
      </form>
    </mat-card>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
  
    mat-card {
      margin-top: 1rem;
    }
  
    .star-rating {
      display: flex;
      gap: 4px;
      margin-bottom: 1rem;
      align-items: center;        /* ✅ Ensures vertical alignment */
    }
  
    .star-rating mat-icon {
      cursor: pointer;
      color: #ccc;
      transition: color 0.2s;
      height: 32px;               /* ✅ Force height to avoid clipping */
      width: 32px;                /* Optional: makes it square */
      line-height: 1;             /* ✅ Avoid inherited line-height */
      vertical-align: middle;     /* ✅ Align nicely with other content */
    }
  
    .star-rating mat-icon.filled {
      color: #FFD600;
    }
  `]
  
})
export class JobReviewFormComponent {
  @Input() jobId!: number;
  reviewForm: FormGroup;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  setRating(rating: number) {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  submitReview() {
    if (this.reviewForm.valid && this.jobId) {
      const dto: CreateReviewDto = this.reviewForm.value;
      this.reviewService.createReviewForJob(this.jobId, dto).subscribe({
        next: () => {
          this.snackBar.open('Review submitted!', 'Close', { duration: 3000 });
          this.reviewForm.reset();
        },
        error: () => {
          this.snackBar.open('Failed to submit review.', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 