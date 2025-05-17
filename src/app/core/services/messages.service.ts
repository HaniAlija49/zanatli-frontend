import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message, CreateMessageDto } from '../../shared/interfaces/message.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getMessages(jobId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${jobId}/messages`).pipe(
      catchError(this.handleError)
    );
  }

  sendMessage(jobId: number, message: CreateMessageDto): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/${jobId}/messages`, message).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.status === 403) {
      errorMessage = 'You are not authorized to access these messages';
    } else if (error.status === 404) {
      errorMessage = 'Job not found';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 