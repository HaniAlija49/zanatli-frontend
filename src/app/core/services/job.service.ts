import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job, CreateJobDto, UpdateJobDto } from '../models/job.models';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getClientJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/client`);
  }

  getContractorJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/contractor`);
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  createJob(job: CreateJobDto): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  updateJob(id: string, job: UpdateJobDto): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  acceptJob(id: string): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/${id}/accept`, {});
  }

  declineJob(id: string, reason: string): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/${id}/decline`, { reason });
  }

  completeJob(id: string): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/${id}/complete`, {});
  }
} 