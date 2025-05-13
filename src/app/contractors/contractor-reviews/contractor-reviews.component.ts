import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.models';

@Component({
  selector: 'app-contractor-reviews',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <mat-card>
      <mat-card-title>Reviews</mat-card-title>
      <div class="reviews-container">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-container">
          <mat-icon>error_outline</mat-icon>
          <p>{{ error }}</p>
        </div>

        <!-- Reviews List -->
        <div *ngIf="!isLoading && !error" class="reviews-list" [class.no-reviews]="!reviews || reviews.length === 0">
          <ng-container *ngIf="reviews && reviews.length > 0; else noReviews">
            <mat-card class="review-item" *ngFor="let review of reviews">
              <div class="review-header">
                <div class="review-stars">
                  <mat-icon *ngFor="let star of stars; let i = index" [ngClass]="{'filled': i < review.rating}">
                    {{ i < review.rating ? 'star' : 'star_border' }}
                  </mat-icon>
                </div>
                <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
              </div>
              <div class="review-comment">{{ review.comment || 'No comment' }}</div>
              <div class="review-client">By: {{ review.client.email }}</div>
            </mat-card>
          </ng-container>
          <ng-template #noReviews>
            <div class="no-reviews">
              <mat-icon>rate_review</mat-icon>
              <p>No reviews yet.</p>
            </div>
          </ng-template>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .reviews-container {
      min-height: 200px;
      position: relative;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #f44336;
      text-align: center;
    }
    .error-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .review-item {
      background: #fffde7;
      border: 1px solid #ffe082;
      border-radius: 10px;
      padding: 1rem 1.2rem;
      box-shadow: 0 2px 8px rgba(255, 214, 0, 0.06);
    }
    .review-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .review-stars {
      display: flex;
      gap: 2px;
      font-size: 20px;
    }
    .review-stars mat-icon {
      color: #FFD600;
      font-size: 22px;
    }
    .review-stars mat-icon:not(.filled) {
      color: #ccc;
    }
    .review-date {
      color: #888;
      font-size: 0.98em;
    }
    .review-comment {
      color: #444;
      font-size: 1.08rem;
      margin-bottom: 0.3rem;
    }
    .review-client {
      color: #1976d2;
      font-size: 0.97em;
      font-weight: 500;
    }
    .no-reviews {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #888;
      text-align: center;
    }
    .no-reviews mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      color: #ccc;
    }
  `]
})
export class ContractorReviewsComponent implements OnInit {
  @Input() contractorId!: string;
  reviews: Review[] = [];
  stars = [1, 2, 3, 4, 5];
  isLoading = false;
  error: string | null = null;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    if (this.contractorId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.isLoading = true;
    this.error = null;
    
    this.reviewService.getReviewsForContractor(this.contractorId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          // If no reviews found, just set empty array
          this.reviews = [];
        } else {
          console.error('Error loading reviews:', error);
          this.error = 'Failed to load reviews. Please try again later.';
        }
        this.isLoading = false;
      }
    });
  }
} 