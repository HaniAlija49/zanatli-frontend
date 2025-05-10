import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Helper method to get full URL
  private getUrl(path: string): string {
    return `${this.apiUrl}${path}`;
  }

  // Generic GET request
  get<T>(path: string) {
    return this.http.get<T>(this.getUrl(path));
  }

  // Generic POST request
  post<T>(path: string, data: any) {
    return this.http.post<T>(this.getUrl(path), data);
  }

  // Generic PATCH request
  patch<T>(path: string, data: any) {
    return this.http.patch<T>(this.getUrl(path), data);
  }

  // Generic DELETE request
  delete<T>(path: string) {
    return this.http.delete<T>(this.getUrl(path));
  }
} 