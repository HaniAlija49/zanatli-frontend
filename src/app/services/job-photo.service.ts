import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface JobPhoto {
  id: number;
  fileName: string;
  uploadedAt: string;
  data: string;
  contentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobPhotoService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  uploadPhoto(jobId: number, file: File): Observable<JobPhoto> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.apiUrl}/${jobId}/photos`;
    console.log('Uploading photo to:', url);
    return this.http.post<JobPhoto>(url, formData).pipe(
      tap(response => console.log('Upload response:', response)),
      catchError(this.handleError)
    );
  }

  getPhotos(jobId: number): Observable<JobPhoto[]> {
    const url = `${this.apiUrl}/${jobId}/photos`;
    console.log('Getting photos from:', url);
    return this.http.get<JobPhoto[]>(url).pipe(
      tap(response => console.log('Get photos response:', response)),
      catchError(this.handleError)
    );
  }

  getPhotoUrl(jobId: number, photoId: number): string {
    return `${this.apiUrl}/${jobId}/photos/${photoId}`;
  }

  deletePhoto(jobId: number, photoId: number): Observable<void> {
    const url = `${this.apiUrl}/${jobId}/photos/${photoId}`;
    console.log('Deleting photo at:', url);
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('Delete successful')),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nURL: ${error.url}`;
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 