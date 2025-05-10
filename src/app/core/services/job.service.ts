import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { CreateJobRequestDto, Job, UpdateJobResponseDto } from '../models/job.models';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private api: ApiService) {}

  createJob(data: CreateJobRequestDto): Observable<Job> {
    return this.api.post<Job>('/jobs', data);
  }

  getClientJobs(): Observable<Job[]> {
    return this.api.get<Job[]>('/jobs/client');
  }

  getContractorJobs(): Observable<Job[]> {
    return this.api.get<Job[]>('/jobs/contractor');
  }

  getJob(id: number): Observable<Job> {
    return this.api.get<Job>(`/jobs/${id}`);
  }

  acceptJob(id: number): Observable<Job> {
    return this.api.patch<Job>(`/jobs/${id}/accept`, {});
  }

  declineJob(id: number, responseMessage: string): Observable<Job> {
    return this.api.patch<Job>(`/jobs/${id}/decline`, { responseMessage });
  }

  completeJob(id: number): Observable<Job> {
    return this.api.patch<Job>(`/jobs/${id}/complete`, {});
  }
} 