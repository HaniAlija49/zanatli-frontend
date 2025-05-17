import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClientDashboard {
  jobStats: {
    totalJobs: number;
    pendingJobs: number;
    acceptedJobs: number;
    completedJobs: number;
  };
  reviewableJobs: {
    id: number;
    description: string;
    preferredDate: string;
    contractorName: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ClientDashboard> {
    return this.http.get<ClientDashboard>(`${this.apiUrl}/client-dashboard`);
  }
} 