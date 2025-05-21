import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job, CreateJobDto, UpdateJobDto } from '../models/job.models';
import { JobPhotoService } from '../../services/job-photo.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(
    private http: HttpClient,
    private jobPhotoService: JobPhotoService
  ) {}

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

  createJob(jobData: CreateJobDto, photos: File[] = []): Observable<Job> {
    return new Observable<Job>(observer => {
      this.http.post<Job>(`${this.apiUrl}`, jobData).subscribe({
        next: (job) => {
          if (photos && photos.length > 0) {
            // Upload photos after job is created
            Promise.all(
              photos.map(photo => 
                this.jobPhotoService.uploadPhoto(Number(job.id), photo).toPromise()
              )
            )
              .then(() => {
                observer.next(job);
                observer.complete();
              })
              .catch(error => {
                observer.error(error);
              });
          } else {
            observer.next(job);
            observer.complete();
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  updateJob(id: string, job: UpdateJobDto): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  acceptJob(id: string): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${id}/accept`, {});
  }

  declineJob(id: string, reason: string): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${id}/decline`, { responseMessage: reason });
  }

  completeJob(id: string): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${id}/complete`, {});
  }
} 