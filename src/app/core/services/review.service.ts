import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, CreateReviewDto } from '../models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getReviewsForContractor(contractorId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/contractors/${contractorId}/reviews`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of([]);
        }
        throw error;
      })
    );
  }

  getReviewForJob(jobId: number): Observable<Review | null> {
    return this.http.get<Review>(`${this.apiUrl}/jobs/${jobId}/review`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      })
    );
  }

  createReviewForJob(jobId: number, review: CreateReviewDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/jobs/${jobId}/review`, review);
  }
} 